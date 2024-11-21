// todo, fix types

// @ts-ignore
import { api } from '../../../scripts/api.js';
// @ts-ignore
import { app } from '../../../scripts/app.js';
// @ts-ignore
import { $el } from '../../../scripts/ui.js';

let feedWindow: Window | null = null;

const toggleWindow = () => {
    window.onmessage = (e) => {
        console.log(e, 'received');
    };

    if (feedWindow) {
        //
        feedWindow.close();
        feedWindow = null;
    } else {
        feedWindow = window.open(
            `/extensions/comfyui-jk-easy-nodes/jk-image-window.html`,
            `_blank`,
            `width=1280,height=720,location=no,toolbar=no,menubar=no`
        )!;
    }

    setInterval(() => {
        feedWindow?.postMessage('test message!!!');
    }, 1000);
};

app.registerExtension({
    name: 'jk.ImageFeed',
    async setup() {
        const seenImages = new Map();

        // @ts-ignore
        const showMenuButton = new (await import('../../../scripts/ui/components/button.js')).ComfyButton({
            icon: 'image-multiple',
            action: () => toggleWindow(),
            tooltip: 'Toggle Image Window',
            content: 'Toggle Image Feed Window'
        });
        showMenuButton.enabled = true;
        showMenuButton.element.style.display = 'block';
        app.menu.settingsGroup.append(showMenuButton);

        app.menu?.settingsGroup.element.before(showMenuButton.element);

        const imageFeed = $el('div.jk-image-feed');
        const imageList = $el('div.jk-image-feed-list');

        function addImageToFeed(href: string) {
            const method = 'prepend';

            // if (maxImages.value > 0 && imageList.children.length >= maxImages.value) {
            // 	imageList.children[method === "prepend" ? imageList.children.length - 1 : 0].remove();
            // }

            imageList[method](
                $el('div', [
                    $el(
                        'a',
                        {
                            target: '_blank',
                            href,
                            onclick: (e: any) => {
                                const imgs = [...imageList.querySelectorAll('img')].map((img) => img.getAttribute('src'));
                                //lightbox.show(imgs, imgs.indexOf(href));
                                e.preventDefault();
                            }
                        },
                        [$el('img', { src: href })]
                    )
                ])
            );
            // If lightbox is open, update it with new image
            //lightbox.updateWithNewImage(href, feedDirection.value);
        }

        window.dispatchEvent(new Event('resize'));

        api.addEventListener('executed', ({ detail }: any) => {
            if (feedWindow && detail?.output?.images) {
                if (detail.node?.includes?.(':')) {
                    // Ignore group nodes
                    const n = app.graph.getNodeById(detail.node.split(':')[0]);
                    if (n?.getInnerNodes) return;
                }

                for (const src of detail.output.images) {
                    const href = `./view?filename=${encodeURIComponent(src.filename)}&type=${src.type}&
					subfolder=${encodeURIComponent(src.subfolder)}&t=${+new Date()}`;

                    //TODO
                    const deduplicateFeed = { value: 0 };
                    // deduplicateFeed.value is essentially the scaling factor used for image hashing
                    // but when deduplication is disabled, this value is "0"
                    if (deduplicateFeed.value > 0) {
                        // deduplicate by ignoring images with the same filename/type/subfolder
                        const fingerprint = JSON.stringify({ filename: src.filename, type: src.type, subfolder: src.subfolder });
                        if (seenImages.has(fingerprint)) {
                            // NOOP: image is a duplicate
                        } else {
                            seenImages.set(fingerprint, true);
                            let img = $el('img', { src: href });
                            img.onerror = () => {
                                // fall back to default behavior
                                addImageToFeed(href);
                            };
                            img.onload = () => {
                                // redraw the image onto a canvas to strip metadata (resize if performance mode)
                                let imgCanvas = document.createElement('canvas');
                                let imgScalar = deduplicateFeed.value;
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
                                    addImageToFeed(href);
                                }
                            };
                        }
                    } else {
                        addImageToFeed(href);
                    }
                }
            }
        });
    }
});
