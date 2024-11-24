import { BroadcastChannel } from 'broadcast-channel';
import { SessionStorageHelper } from '../common/storage.js';
import { GalleryImageData, JKImageGallery } from './gallery.js';

import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('../../node_modules/@shoelace-style/shoelace/dist');
import '@shoelace-style/shoelace/dist/components/split-panel/split-panel.js';
import '@shoelace-style/shoelace/dist/components/spinner/spinner.js';
import '@shoelace-style/shoelace/dist/components/badge/badge.js';
import '@shoelace-style/shoelace/dist/components/details/details.js';
import '@shoelace-style/shoelace/dist/components/icon/icon.js';
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
interface NewImgMessage extends BaseImageViewMessage<GalleryImageData> {
    type: 'new-image';
}

interface RequestAllImages extends BaseImageViewMessage<{ images: GalleryImageData[]; cssVars: Record<string, string> }> {
    type: 'request-all';
}

const channel = new BroadcastChannel<HeartBeatMessage | NewImgMessage | RequestAllImages | ClosedMessage>('jk-image-viewer');

// set in the html file first script
const IS_FEED_WINDOW = !!(window as any).jkImageWindow;

if (IS_FEED_WINDOW) {
    const Gallery = new JKImageGallery(document.getElementById('jk-image-gallery') as HTMLDivElement, document.getElementById('jk-feed-bar') as HTMLDivElement);

    // dont do init till after we request-all data from main window, comfy api may not be available yet
    const init = async () => {
        await Gallery.init();
    };

    channel.addEventListener('message', async (m) => {
        switch (m.type) {
            case 'heartbeat':
                break;
            case 'new-image':
                Gallery.addImage(m.data);
                break;
            case 'request-all':
                await init();
                await Gallery.addImages(m.data.images);
                for (const [key, value] of Object.entries(m.data.cssVars)) {
                    document.documentElement.style.setProperty(key, value);
                }
        }
    });

    // on first load, request all data that the main window has
    channel.postMessage({ type: 'request-all', data: { images: [], cssVars: {} } });
} else {
    // setup the extension, we in comfy main window
    let CURRENT_IMAGES: GalleryImageData[] = SessionStorageHelper.getJSON('feed') ?? [];

    const setup = async () => {
        const sendImageToFeed = (data: GalleryImageData) => {
            CURRENT_IMAGES.push(data);
            SessionStorageHelper.setJSONVal('feed', CURRENT_IMAGES);
            channel.postMessage({ type: 'new-image', data: data });
        };

        // @ts-ignore
        const { api } = await import('../../../../scripts/api.js');
        // @ts-ignore
        const { app } = await import('../../../../scripts/app.js');
        // @ts-ignore
        const { $el } = await import('../../../../scripts/ui.js');
        let feedWindow: Window | null = null;

        const { getElementCSSVariables } = await import('../common/utils.js');

        const toggleWindow = () => {
            const isOpen = feedWindow ? !feedWindow.closed : false;

            if (isOpen) {
                feedWindow?.close();
                feedWindow = null;
            } else {
                feedWindow = window.open(
                    `/extensions/comfyui-jk-easy-nodes/gallery/jk-image-window.html`,
                    `_blank`,
                    `width=1280,height=720,location=no,toolbar=no,menubar=no`
                )!;
                // @ts-ignore
                feedWindow.comfyAPI = window.comfyAPI;
            }
            window.addEventListener('beforeunload', (e) => {
                feedWindow?.close();
            });
        };

        channel.addEventListener('message', (m) => {
            switch (m.type) {
                case 'request-all':
                    if (feedWindow) {
                        // @ts-ignore
                        feedWindow.comfyAPI = window.comfyAPI;
                        document.querySelectorAll('link, style').forEach((htmlElement) => {
                            const cloned: HTMLLinkElement | HTMLStyleElement = htmlElement.cloneNode(true) as any;
                            if ((cloned as HTMLLinkElement).href) {
                                (cloned as HTMLLinkElement).href = (cloned as HTMLLinkElement).href.replace(
                                    window.location.protocol + '//' + window.location.host,
                                    ''
                                );
                            }
                            feedWindow!.document.head.appendChild(cloned);
                        });
                        const comfyCssVars = getElementCSSVariables();
                        channel.postMessage({ type: 'request-all', data: { images: CURRENT_IMAGES, cssVars: comfyCssVars } });
                    }

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

                let startTime = new Date();
                api.addEventListener('execution_start', () => {
                    startTime = new Date();
                });
                // from pysss
                api.addEventListener('executed', ({ detail }: any) => {
                    const execTimeMs = new Date().getTime() - startTime.getTime();

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
                                            sendImageToFeed({
                                                href,
                                                subfolder: src.subfolder,
                                                type: src.type,
                                                nodeId: nodeId,
                                                nodeTitle: title,
                                                fileName: src.filename,
                                                execTimeMs
                                            });
                                        }
                                    };
                                }
                            } else {
                                sendImageToFeed({
                                    href,
                                    subfolder: src.subfolder,
                                    type: src.type,
                                    nodeId: nodeId,
                                    nodeTitle: title,
                                    fileName: src.filename,
                                    execTimeMs
                                });
                            }
                        });
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
