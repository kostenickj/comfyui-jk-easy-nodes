// src_web/gallery/gallery.ts
var JKImage = class {
  constructor(m) {
    this.m = m;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("jk-img-wrapper");
    this.spinner = document.createElement("div");
    this.spinner.innerHTML = `<div class="jk-spinner-wrap"><sl-spinner style="font-size: 3rem; --track-width: 3px; --track-color: var(--border-color); --indicator-color: var(--p-progressspinner-color-2)"></sl-spinner></div>`;
    this.wrapper.append(this.spinner);
    this.title = document.createElement("div");
    this.title.textContent = `${m.nodeTitle} - #${m.nodeId} ${m.fileName}`;
    this.title.classList.add("jk-img-title");
    this.wrapper.append(this.title);
  }
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const loadMe = new Image();
      loadMe.onload = (ev) => {
        return resolve(loadMe);
      };
      loadMe.onerror = reject;
      loadMe.src = url;
    });
  }
  async init() {
    this.img = await this.loadImage(this.m.href);
    this.img.src = this.m.href;
    this.img.classList.add("jk-img");
    this.wrapper.appendChild(this.img);
    this.wrapper.removeChild(this.spinner);
    return this;
  }
  getEl() {
    return this.wrapper;
  }
};
var JKImageGallery = class {
  constructor(container) {
    this.container = container;
    this.images = [];
  }
  async addImage(data) {
    const img = await new JKImage(data).init();
    this.images.unshift(img);
    this.container.prepend(img.getEl());
  }
  async addImages(imgs) {
    await Promise.all(imgs.map((i) => this.addImage(i)));
  }
};
export {
  JKImageGallery
};
