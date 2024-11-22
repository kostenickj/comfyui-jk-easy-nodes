import { BroadcastChannel } from 'broadcast-channel';

// TODO, the actual gallery
import lightGallery from 'lightgallery';
import { SessionStorageHelper } from './common/storage.js';

interface ImageData {
    subfolder: string;
    type: string;
    href: string;
    nodeTitle: string;
    nodeId: number;
}

interface BaseImageViewMessage<T> {
    data: T;
    type: 'new-image' | 'heartbeat' | 'request-all' | 'closed';
}

interface HeartBeatMessage extends BaseImageViewMessage<undefined> {
    type: 'heartbeat';
}
interface ClosedMessage extends BaseImageViewMessage<undefined> {
    type: 'closed';
}
interface NewImgMessage extends BaseImageViewMessage<ImageData> {
    type: 'new-image';
}

interface RequestAllImages extends BaseImageViewMessage<ImageData[]> {
    type: 'request-all';
}

const channel = new BroadcastChannel<HeartBeatMessage | NewImgMessage | RequestAllImages | ClosedMessage>('jk-image-viewer');

let CURRENT_IMAGES: ImageData[] = SessionStorageHelper.getJSON('feed') ?? [];

// set in the html file first script
const IS_FEED_WINDOW = !!(window as any).jkImageWindow;

if (IS_FEED_WINDOW) {
    const addImageToGallery = (m: ImageData) => {
        const img = document.createElement('img');
        img.src = m.href;
        document.getElementById('jk-img-container')!.appendChild(img);
    };

    channel.addEventListener('message', (m) => {
        switch (m.type) {
            case 'heartbeat':
                break;
            case 'new-image':
                CURRENT_IMAGES.push(m.data);
                addImageToGallery(m.data);
                break;
            case 'request-all':
                CURRENT_IMAGES = m.data;
                CURRENT_IMAGES.forEach((x) => addImageToGallery(x));
            // TODO, also reload lightbox or whatever
        }
    });

    // on first load, request all images that the main window has
    channel.postMessage({ type: 'request-all', data: [] });
} else {
    // setup the extension, we in comfy main window
    const setup = async () => {
        const addImageToFeed = (data: ImageData) => {
            CURRENT_IMAGES.push(data);
            SessionStorageHelper.setJSONVal('feed', CURRENT_IMAGES);
            channel.postMessage({ type: 'new-image', data: data });
        };

        // @ts-ignore
        const { api } = await import('../../../scripts/api.js');
        // @ts-ignore
        const { app } = await import('../../../scripts/app.js');
        // @ts-ignore
        const { $el } = await import('../../../scripts/ui.js');
        let feedWindow: Window | null = null;

        const toggleWindow = () => {
            const isOpen = feedWindow ? !feedWindow.closed : false;

            if (isOpen) {
                feedWindow?.close();
                feedWindow = null;
            } else {
                feedWindow = window.open(
                    `/extensions/comfyui-jk-easy-nodes/jk-image-window.html`,
                    `_blank`,
                    `width=1280,height=720,location=no,toolbar=no,menubar=no`
                )!;
            }
            window.addEventListener('beforeunload', (e) => {
                feedWindow?.close();
            });
        };

        channel.addEventListener('message', (m) => {
            switch (m.type) {
                case 'request-all':
                    channel.postMessage({ type: 'request-all', data: CURRENT_IMAGES });
                    break;
                case 'closed':
                    console.log('feed window was closed');
                    feedWindow = null;
            }
        });

        app.registerExtension({
            name: 'jk.ImageFeed',
            async setup() {
                const seenImages = new Map<string | number, boolean>();

                // @ts-ignore
                const showMenuButton = new (await import('../../../scripts/ui/components/button.js')).ComfyButton({
                    icon: 'image-multiple',
                    action: () => toggleWindow(),
                    tooltip: 'Toggle Image Window',
                    content: 'Toggle Image Feed Window'
                });
                showMenuButton.enabled = true;
                showMenuButton.element.style.display = 'block';
                window.dispatchEvent(new Event('resize'));
                app.menu.settingsGroup.append(showMenuButton);

                // from pysss
                api.addEventListener('executed', ({ detail }: any) => {
                    const nodeId: number = parseInt(detail.node, 10);
                    const node = app.graph.getNodeById(nodeId);
                    const title: string = node.title;
                    if (detail?.output?.images) {
                        if (detail.node?.includes?.(':')) {
                            // Ignore group nodes
                            const n = app.graph.getNodeById(detail.node.split(':')[0]);
                            if (n?.getInnerNodes) return;
                        }

                        (detail.output.images as Array<any>).forEach((src) => {
                            const href = `/view?filename=${encodeURIComponent(src.filename)}&type=${src.type}&subfolder=${encodeURIComponent(
                                src.subfolder
                            )}&t=${+new Date()}`;

                            const deduplicateFeed = true;
                            if (deduplicateFeed) {
                                // deduplicate by ignoring images with the same filename/type/subfolder
                                const fingerprint = JSON.stringify({ filename: src.filename, type: src.type, subfolder: src.subfolder });
                                if (seenImages.has(fingerprint)) {
                                    // NOOP: image is a duplicate
                                } else {
                                    seenImages.set(fingerprint, true);
                                    let img = $el('img', { src: href });

                                    img.onload = () => {
                                        // redraw the image onto a canvas to strip metadata (resize if performance mode)
                                        let imgCanvas = document.createElement('canvas');
                                        let imgScalar = 1;
                                        imgCanvas.width = imgScalar * img.width;
                                        imgCanvas.height = imgScalar * img.height;

                                        let imgContext = imgCanvas.getContext('2d')!;
                                        imgContext.drawImage(img, 0, 0, imgCanvas.width, imgCanvas.height);
                                        const data = imgContext.getImageData(0, 0, imgCanvas.width, imgCanvas.height);

                                        // calculate fast hash of the image data
                                        let hash = 0;
                                        for (const b of data.data) {
                                            hash = (hash << 5) - hash + b;
                                        }

                                        // add image to feed if we've never seen the hash before
                                        if (seenImages.has(hash)) {
                                            // NOOP: image is a duplicate
                                        } else {
                                            // if we got to here, then the image is unique--so add to feed
                                            seenImages.set(hash, true);
                                            addImageToFeed({ href, subfolder: src.subfolder, type: src.type, nodeId: nodeId, nodeTitle: title });
                                        }
                                    };
                                }
                            } else {
                                addImageToFeed({ href, subfolder: src.subfolder, type: src.type, nodeId: nodeId, nodeTitle: title });
                            }
                        });
                        for (const src of detail.output.images) {
                        }
                    }
                });
            }
        });
    };

    setup();
}

// also add option to ignore temp dir, etc.

// also try what this guy is doing here: https://github.com/tachyon-beep/comfyui-simplefeed/blob/main/web/js/imageTray.js#L1252
// detecting image nodes, would that be better?
// try that first, install and debug and se what hes doing
