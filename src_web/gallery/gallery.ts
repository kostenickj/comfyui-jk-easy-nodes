import { EFeedBarEvents, EFeedMode, FeedBarEvent, JKFeedBar } from './feedBar';
import { findKeyValueRecursive } from '../common/utils';
import '@alenaksu/json-viewer';
// have to import this way cuz the exports/types seem to be exported wrong
import type { JsonViewer } from '../../node_modules/@alenaksu/json-viewer/dist/JsonViewer';
//@ts-ignore
import eye from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/eye-fill.svg';

import BiggerPicture, { BiggerPictureInstance } from 'bigger-picture';
import type { SlSplitPanel } from '@shoelace-style/shoelace';

import Macy from 'macy';

// interface not exported -.-
type BPItem = BiggerPictureInstance['items'][number];

const formattedTitle = (m: GalleryImageData) => {
    return `${m.nodeTitle} - (#${m.nodeId})`;
};

export interface GalleryImageData {
    subfolder: string;
    type: string;
    href: string;
    nodeTitle: string;
    nodeId: number;
    fileName: string;
    execTimeMs: number;
}
class JKImage {
    img!: HTMLImageElement;
    wrapper: HTMLDivElement;
    spinner: HTMLDivElement;
    info?: HTMLDivElement;
    opacityOverlay?: HTMLDivElement;

    public get data() {
        return this.m;
    }

    loadImage(url: string) {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const loadMe = new Image();
            loadMe.onload = (ev) => {
                return resolve(loadMe);
            };
            loadMe.onerror = reject;
            loadMe.src = url;
        });
    }

    constructor(private m: GalleryImageData, showInfo: boolean, showOpacityOverlay: boolean, private clickedCallback?: (m: GalleryImageData) => void) {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('jk-img-wrapper');

        if (showOpacityOverlay) {
            this.opacityOverlay = document.createElement('div');
            this.opacityOverlay.innerHTML = `<sl-icon src="${eye}"></sl-icon>`;
            this.opacityOverlay.classList.add('jk-img-hover');
            this.wrapper.append(this.opacityOverlay);
        }

        this.spinner = document.createElement('div');
        this.spinner.innerHTML = `<div class="jk-spinner-wrap"><sl-spinner style="font-size: 3rem; --track-width: 3px; --track-color: var(--border-color); --indicator-color: var(--p-progressspinner-color-2)"></sl-spinner></div>`;
        this.wrapper.append(this.spinner);

        if (showInfo) {
            this.info = document.createElement('div');
            this.info.textContent = `${m.nodeTitle} - (#${m.nodeId})`;
            this.info.innerHTML = `
                <div class="jk-img-info-title">
                    <sl-badge variant="neutral">
                            ${m.nodeTitle} - (#${m.nodeId})
                    </sl-badge>
                </div>
                  <div class="jk-img-info-time">
                    <sl-badge variant="success"> 
                        ${(m.execTimeMs / 1000).toFixed(2)}s
                    </sl-badge>
                </div>
            `;
            this.info.classList.add('jk-img-info-wrapper');
            this.wrapper.append(this.info);
        }
    }

    public async init() {
        this.img = await this.loadImage(this.m.href);
        this.img.src = this.m.href;
        this.img.onclick = (ev) => {
            this.clickedCallback?.(this.m);
        };
        this.img.classList.add('jk-img');
        this.wrapper.appendChild(this.img);
        this.wrapper.removeChild(this.spinner);
        return this;
    }

    public getEl() {
        return this.wrapper;
    }
}

class JKRightPanelImage {
    img!: JKImage;
    container: HTMLDivElement;
    info: HTMLDivElement;

    promptMetadata?: Record<string, any>;
    promptViewer?: JsonViewer;
    title: HTMLDivElement;

    seed?: number | null;
    infoDialog: HTMLDialogElement;
    buttonGroup: HTMLDivElement;
    viewPrompInfoButton?: { element: HTMLElement };
    dialogCloseBtn: HTMLButtonElement;
    promptSearch?: HTMLInputElement;
    expandAllBtn?: HTMLButtonElement;
    collapseAllBtn?: HTMLButtonElement;

    currentSearch?: Generator<any>;

    constructor(private data: GalleryImageData, private onOpenLightboxRequest: (selectedImg: JKImage, data: GalleryImageData) => void) {
        this.container = document.createElement('div');
        this.container.classList.add('jk-rightpanel-container');

        this.title = document.createElement('div');
        this.title.classList.add('jk-rightpanel-title');

        this.infoDialog = document.createElement('dialog');
        this.infoDialog.classList.add('jk-info-dialog');

        this.dialogCloseBtn = document.createElement('button');
        this.dialogCloseBtn.innerText = 'X';
        this.dialogCloseBtn.classList.add('jk-dialog-close-btn');
        this.dialogCloseBtn.onclick = () => {
            if (this.infoDialog) {
                this.promptSearch!.value = '';
                this.infoDialog.close();
            }
        };
        this.infoDialog.innerHTML = `
            <div class="info-dialog-header">
                <input autofocus id="prompt-search" type="text" placeholder="search"></input>
                <div class="comfyui-menu"> 
                      <button class="comfyui-button" id="info-expand-all"> Expand All </button>
                    <button class="comfyui-button" id="info-collapse-all"> Collapse All </button>
                </div>          
            </div>
        `;

        this.infoDialog.appendChild(this.dialogCloseBtn);
        this.buttonGroup = document.createElement('div');
        this.buttonGroup.classList.add('comfyui-button-group');
        this.info = document.createElement('div');
        this.info.classList.add('jk-info-dialog-inner');
        this.infoDialog.appendChild(this.info);
    }

    public getEl() {
        return this.container;
    }

    private showInfoModal() {
        this.infoDialog.showModal();
        this.promptSearch = document.getElementById('prompt-search') as HTMLInputElement;
        this.expandAllBtn = document.getElementById('info-expand-all') as HTMLButtonElement;
        this.expandAllBtn.addEventListener('click', (ev) => {
            this.promptViewer?.expandAll();
            this.promptViewer?.resetFilter();
            this.currentSearch = undefined;
        });
        this.collapseAllBtn = document.getElementById('info-collapse-all') as HTMLButtonElement;
        this.collapseAllBtn?.addEventListener('click', (ev) => {
            this.promptViewer?.collapseAll();
            this.promptViewer?.resetFilter();
            this.currentSearch = undefined;
        });
        this.promptSearch.addEventListener('input', (ev) => {
            this.currentSearch = this.promptViewer?.search(((ev?.target as HTMLInputElement)?.value as string) ?? '');
        });
        this.promptSearch.addEventListener('keyup', async (e) => {
            if (this.currentSearch && (e.keyCode === 13 || e.key.toLowerCase() === 'enter')) {
                await this.currentSearch.next();
                setTimeout(() => {
                    this.promptSearch?.focus();
                }, 1);
            }
        });
    }

    private async tryLoadMetaData() {
        try {
            const blob = await fetch(this.data.href).then((r) => r.blob());
            //@ts-ignore
            const metadata = await window.comfyAPI.pnginfo.getPngMetadata(blob);
            this.promptMetadata = JSON.parse(metadata?.prompt);
            const seed = findKeyValueRecursive(this.promptMetadata, 'seed');
            if (typeof seed?.seed === 'number') {
                this.seed = seed.seed;
                document.getElementById('seed')!.innerText = `Seed: ${this.seed}`;
            }
            this.promptViewer = document.createElement('json-viewer') as unknown as JsonViewer;
            this.promptViewer.data = { prompt: this.promptMetadata! };
            this.info.appendChild(this.promptViewer as any);

            //@ts-ignore
            const ComfyButton = (await import('../../../scripts/ui/components/button.js')).ComfyButton;

            // any mdi icons seem to work in icon field
            this.viewPrompInfoButton = new ComfyButton({
                icon: 'information',
                action: () => {
                    this.showInfoModal();
                },
                tooltip: 'View Prompt Info',
                content: 'Prompt Info'
            });
            this.viewPrompInfoButton!.element.classList.add('jk-view-prompt-info-btn');
            document.getElementById('right-panel-btn-group')?.appendChild(this.viewPrompInfoButton!.element);
        } catch (err) {
            console.error('failed to get metadata', err);
            try {
                this.title.removeChild(document.getElementById('right-panel-btn-group')!);
                this.title.removeChild(document.getElementById('seed')!);
            } catch (e) {}
        }

        window.dispatchEvent(new Event('resize'));
    }

    public resizeHack() {
        // i suck at css, hence this
        if (!this.img || !this.title) return;
        this.img.getEl().style.height = `calc(100% - ${this.title.clientHeight}px)`;
    }

    public async init() {
        this.container.appendChild(this.title);
        this.title.innerHTML = `
        <div>
            ${this.data.nodeTitle} - (#${this.data.nodeId})
        </div>
         <div>
            filename: ${this.data.fileName}
        </div>
        <div id="seed"> </div>
        <div id="right-panel-btn-group" class="comfyui-menu">
            
        </div>
        `;

        this.img = await new JKImage(this.data, false, true).init();
        this.container.appendChild(this.img.getEl());
        this.img.opacityOverlay?.addEventListener('click', (ev) => {
            this.onOpenLightboxRequest(this.img, this.data);
        });

        this.container.appendChild(this.infoDialog);

        // dont await, it takes a bit
        this.tryLoadMetaData();

        setTimeout(() => {
            window.dispatchEvent(new Event('resize'));
        }, 1);

        return this;
    }
}

export class JKImageGallery extends EventTarget {
    private initialized = false;
    private images: JKImage[] = [];

    private selectedImage?: JKRightPanelImage;
    // map of formatted node title => all image outputs we have from that node
    imageMap: Map<string, GalleryImageData[]> = new Map<string, GalleryImageData[]>();
    FeedBar: JKFeedBar;
    lightbox: BiggerPictureInstance;
    feedPanel: SlSplitPanel;
    gridPanel: HTMLDivElement;
    currentMode: EFeedMode = EFeedMode.feed;

    private _macy?: Macy;

    private get macy() {
        if (!this._macy) {
            this._macy = new Macy({
                container: '#jk-grid-inner',
                trueOrder: true,
                margin: 24,
                columns: 6,
                breakAt: {
                    1200: 5,
                    940: 3,
                    520: 2,
                    400: 1
                }
            });
        }
        return this._macy;
    }

    private get leftPanel() {
        return document.getElementById('jk-gallery-left-panel') as HTMLDivElement;
    }
    private get rightPanel() {
        return document.getElementById('jk-gallery-right-panel') as HTMLDivElement;
    }
    constructor(private container: HTMLDivElement, private feedBarContainer: HTMLDivElement) {
        super();
        this.container.innerHTML = `
            <sl-split-panel id="jk-feed-panel" position="15" style="--max: 35%; --min:10%;">
                <div
                    id="jk-gallery-left-panel"
                    slot="start"
                >
                </div>
                <div
                    slot="end"
                    id="jk-gallery-right-panel"
                >
                </div>
            </sl-split-panel>
            <div id="jk-grid-panel"> 
                <div id="jk-grid-inner"> </div>
            </div>
        `;
        this.FeedBar = new JKFeedBar(this.feedBarContainer);
        this.feedPanel = document.getElementById('jk-feed-panel') as SlSplitPanel;
        this.gridPanel = document.getElementById('jk-grid-inner') as HTMLDivElement;

        // i suck at css, hence this
        window.addEventListener('resize', () => {
            this.selectedImage?.resizeHack();
        });

        this.lightbox = BiggerPicture({
            target: document.body
        });
    }

    public async init(mode: EFeedMode) {
        if (!this.initialized) {
            this.initialized = true;
            await this.FeedBar.init();
            this.FeedBar.addEventListener(EFeedBarEvents['feed-clear'], this.clearFeed);
            this.FeedBar.addEventListener(EFeedBarEvents['check-change'], this.updateImageVisibility);
            this.FeedBar.addEventListener(EFeedBarEvents['feed-mode'], (ev) => this.handleModeChange((ev as FeedBarEvent<EFeedMode>).detail));
        }

        if (mode !== this.currentMode) {
            this.handleModeChange(mode);
        }
    }

    private async selectImage(data: GalleryImageData) {
        this.selectedImage = await new JKRightPanelImage(data, this.handleOpenLightbox).init();

        this.rightPanel.replaceChildren(this.selectedImage.getEl());
    }

    private handleImageClicked = (data: GalleryImageData) => {
        this.selectImage(data);
    };

    public async addImage(data: GalleryImageData, updateFeedBar: boolean) {
        const nodeTitle = formattedTitle(data);

        let isNewNode = false;
        if (!this.imageMap.has(nodeTitle)) {
            this.imageMap.set(nodeTitle, []);
            isNewNode = true;
        }

        this.imageMap.get(nodeTitle)!.unshift(data);

        const img = await new JKImage(data, true, false, this.handleImageClicked).init();
        this.images.unshift(img);
        this.leftPanel.prepend(img.getEl());
        if (updateFeedBar && isNewNode) {
            this.FeedBar.addCheckboxOptionIfNeeded(nodeTitle, true);
        }
    }

    public async addImages(imgs: GalleryImageData[]) {
        if (!imgs) return;
        //promise.all was not executing in order so they were appearing in random order on page reload
        //await Promise.all(imgs.map((i) => this.addImage(i)));
        for (const i of imgs) {
            await this.addImage(i, false);
        }

        if (!this.selectedImage && imgs.length) {
            this.selectImage(imgs[0]!);
        }
        this.FeedBar.updateCheckboxOptions([...this.imageMap.keys()], true);
    }

    public clearFeed = (ev: any) => {
        if (confirm('are you sure you want to clear the feed? This cant be undone!')) {
            this.leftPanel.innerHTML = ``;
            this.images = [];
            this.rightPanel.innerHTML = ``;
            this.selectedImage = undefined;
            this.imageMap = new Map<string, GalleryImageData[]>();
            this.dispatchEvent(new Event(EFeedBarEvents['feed-clear']));
        }
    };

    handleModeChange = async (newMode: EFeedMode) => {
        if (newMode === EFeedMode.grid) {
            this.feedPanel.style.display = 'none';
            this.gridPanel.style.display = 'flex';

            this.gridPanel.innerHTML = ``;

            // TODO, use jkimage for these so they have lightbox
            this.images.forEach(i =>{
                const newImg = document.createElement('img');
                newImg.src = i.data.href;
                this.gridPanel.appendChild(newImg);
            });

            this.macy?.reInit()
        } else {
            this.feedPanel.style.display = 'grid';
            this.gridPanel.style.display = 'none';
            this._macy?.remove();
        }

        this.currentMode = newMode;
    };

    private handleOpenLightbox = (selectedImg: JKImage, data: GalleryImageData) => {
        let openAtIndex = 0;
        const items: BPItem[] = [];

        // TODO, parts of this could probably we cached for perf, will def run into issues if someone gets thousands of images in a session
        let imageIndex = 0;
        this.images.forEach((x) => {
            const isChecked = this.FeedBar.checkedItems.get(formattedTitle(x.data));
            if (isChecked) {
                if (x.data.href === selectedImg.data.href) {
                    openAtIndex = imageIndex;
                }
                items.push({
                    img: x.data.href,
                    thumb: x.data.href,
                    height: x.img.naturalHeight,
                    width: x.img.naturalWidth,
                    caption: x.data.fileName
                });
                imageIndex++;
            }
        });

        this.lightbox.open({
            items,
            intro: 'fadeup',
            position: openAtIndex,
            onUpdate: (container, activeItem) => {
                const itemData = this.images[activeItem?.['i']]?.data;
                if (itemData) {
                    this.selectImage(itemData);
                }
            }
        });
    };

    private updateImageVisibility = () => {
        this.images.forEach((i) => {
            const isChecked = this.FeedBar.checkedItems.get(formattedTitle(i.data));
            i.getEl().style.display = isChecked ? 'flex' : 'none';
        });
    };
}
