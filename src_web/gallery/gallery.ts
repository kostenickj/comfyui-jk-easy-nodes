import { JKFeedBar } from './feedBar';

//@ts-ignore
import eye from '../../node_modules/@shoelace-style/shoelace/dist/assets/icons/eye-fill.svg';


console.log(eye)
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
    title: HTMLDivElement;
    opacityHover: HTMLDivElement;

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

    constructor(private m: GalleryImageData) {
        this.wrapper = document.createElement('div');
        this.wrapper.classList.add('jk-img-wrapper');

        this.opacityHover = document.createElement('div');
        this.opacityHover.innerHTML = `<sl-icon src="${eye}"></sl-icon>`;
        this.opacityHover.classList.add('jk-img-hover');
        this.wrapper.append(this.opacityHover);

        this.spinner = document.createElement('div');
        this.spinner.innerHTML = `<div class="jk-spinner-wrap"><sl-spinner style="font-size: 3rem; --track-width: 3px; --track-color: var(--border-color); --indicator-color: var(--p-progressspinner-color-2)"></sl-spinner></div>`;
        this.wrapper.append(this.spinner);

        this.title = document.createElement('div');
        this.title.textContent = `${m.nodeTitle} - (#${m.nodeId})`;
        this.title.innerHTML = `
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
        this.title.classList.add('jk-img-info-wrapper');
        this.wrapper.append(this.title);
    }

    public async init() {
        this.img = await this.loadImage(this.m.href);
        this.img.src = this.m.href;
        this.img.classList.add('jk-img');
        this.wrapper.appendChild(this.img);
        this.wrapper.removeChild(this.spinner);
        return this;
    }

    public getEl() {
        return this.wrapper;
    }
}

export class JKImageGallery {
    private initialized = false;

    private images: JKImage[] = [];
    // node title and # => image
    imageMap: Map<string, GalleryImageData[]> = new Map<string, GalleryImageData[]>();
    FeedBar: JKFeedBar;

    //TODO, add ability to toggle which ouputs to view images from based on node title/#
    // add clear button
    // implement right sigght of gallery, on first load if no image there load the first image we get
    // on click go full screen?
    // add grid mode like map does? not sure i care

    private get leftPanel() {
        return document.getElementById('jk-gallery-left-panel') as HTMLDivElement;
    }
    private get rightPanel() {
        return document.getElementById('jk-gallery-right-panel') as HTMLDivElement;
    }
    constructor(private container: HTMLDivElement, private feedBarContainer: HTMLDivElement) {
        this.container.innerHTML = `
            <sl-split-panel position="15" style="--max: 35%; --min:10%;">
                <div
                    id="jk-gallery-left-panel"
                    slot="start"
                >
                </div>
                <div
                    slot="end"
                    id="jk-gallery-right-panel"
                >
                    todo
                </div>
            </sl-split-panel>
        `;
        this.FeedBar = new JKFeedBar(feedBarContainer);
    }

    public async init() {
        if (!this.initialized) {
            this.initialized = true;
            await this.FeedBar.init();
        }
    }

    public async addImage(data: GalleryImageData) {
        const nodeTitle = `${data.nodeTitle} - (#${data.nodeId})`;

        if (!this.imageMap.has(nodeTitle)) this.imageMap.set(nodeTitle, []);

        this.imageMap.get(nodeTitle)!.unshift(data);

        const img = await new JKImage(data).init();
        this.images.unshift(img);
        this.leftPanel.prepend(img.getEl());
    }

    public async addImages(imgs: GalleryImageData[]) {
        //promise.all was not executing in order so they were appearing in random order on page reload
        //await Promise.all(imgs.map((i) => this.addImage(i)));
        for (const i of imgs) {
            await this.addImage(i);
        }
    }
}
