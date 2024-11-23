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
        this.opacityHover.innerHTML = `<sl-icon name="eye"></sl-icon>`;
        this.opacityHover.classList.add('jk-img-hover');
        this.wrapper.append(this.opacityHover);

        this.spinner = document.createElement('div');
        this.spinner.innerHTML = `<div class="jk-spinner-wrap"><sl-spinner style="font-size: 3rem; --track-width: 3px; --track-color: var(--border-color); --indicator-color: var(--p-progressspinner-color-2)"></sl-spinner></div>`;
        this.wrapper.append(this.spinner);

        this.title = document.createElement('div');
        this.title.textContent = `${m.nodeTitle} - (#${m.nodeId})`;
        this.title.innerHTML = `
            <div class="jk-img-info-title">
                ${m.nodeTitle} - (#${m.nodeId})
            </div>
              <div class="jk-img-info-time">
                ${(m.execTimeMs / 1000).toFixed(2)}s
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
    private images: JKImage[] = [];
    
    //TODO, add ability to toggle which ouputs to view images from based on node title/#
    // add clear button
    // implement right sight of gallery
    // show on click, also show filename below it

    private get leftPanel() {
        return document.getElementById('jk-gallery-left-panel') as HTMLDivElement;
    }
    private get rightPanel() {
        return document.getElementById('jk-gallery-right-panel') as HTMLDivElement;
    }
    constructor(private container: HTMLElement) {
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
    }

    public async addImage(data: GalleryImageData) {
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
