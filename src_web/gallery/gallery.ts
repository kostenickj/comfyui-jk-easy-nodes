export interface GalleryImageData {
    subfolder: string;
    type: string;
    href: string;
    nodeTitle: string;
    nodeId: number;
    fileName: string;
}

class JKImage {
    img?: HTMLImageElement;
    wrapper: HTMLDivElement;
    spinner: HTMLDivElement;
    title: HTMLDivElement;

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

        this.spinner = document.createElement('div');
        this.spinner.innerHTML = `<div class="jk-spinner-wrap"><div class="jk-spinner"></div></div>`
        this.wrapper.append(this.spinner);

        this.title = document.createElement('div');
        this.title.textContent = `${m.nodeTitle} - #${m.nodeId} ${m.fileName}`;
        this.wrapper.append(this.title);
    }

    public async init() {
        this.img = await this.loadImage(this.m.href);
        this.img.src = this.m.href;
        this.img.classList.add('jk-img');
        this.wrapper.appendChild(this.img);
        this.spinner.style.opacity = '0';
        this.wrapper.removeChild(this.spinner)
        return this;
    }

    public getEl() {
        return this.wrapper;
    }
}

export class JKImageGallery {
    private images: JKImage[] = [];

    constructor(private container: HTMLElement) {}

    public async addImage(data: GalleryImageData) {
        const img = await new JKImage(data).init();
        this.images.unshift(img);
        this.container.prepend(img.getEl());
    }

    public async addImages(imgs: GalleryImageData[]) {
        await Promise.all(imgs.map((i) => this.addImage(i)));
    }
}
