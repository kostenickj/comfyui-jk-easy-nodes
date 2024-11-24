// src_web/gallery/feedBar.ts
var JKFeedBar = class {
  constructor(el) {
    this.el = el;
    this.el.classList.add("comfyui-menu", "flex", "items-center");
    this.buttonGroup = document.createElement("div");
    this.el.append(this.buttonGroup);
    this.buttonGroup.classList.add("comfyui-button-group");
  }
  async init() {
    const ComfyButton = (await import("../../../scripts/ui/components/button.js")).ComfyButton;
    const test = new ComfyButton({
      icon: "image-multiple",
      action: () => {
        console.log("gldkdkd");
      },
      tooltip: "Toggle Image Window",
      content: "test button"
    });
    this.buttonGroup.append(test.element);
    console.log(test);
  }
};

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/assets/icons/eye-fill.svg
var eye_fill_default = "../eye-fill-RBTRTZO3.svg";

// src_web/gallery/gallery.ts
console.log(eye_fill_default);
var JKImage = class {
  constructor(m) {
    this.m = m;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("jk-img-wrapper");
    this.opacityHover = document.createElement("div");
    this.opacityHover.innerHTML = `<sl-icon src="${eye_fill_default}"></sl-icon>`;
    this.opacityHover.classList.add("jk-img-hover");
    this.wrapper.append(this.opacityHover);
    this.spinner = document.createElement("div");
    this.spinner.innerHTML = `<div class="jk-spinner-wrap"><sl-spinner style="font-size: 3rem; --track-width: 3px; --track-color: var(--border-color); --indicator-color: var(--p-progressspinner-color-2)"></sl-spinner></div>`;
    this.wrapper.append(this.spinner);
    this.title = document.createElement("div");
    this.title.textContent = `${m.nodeTitle} - (#${m.nodeId})`;
    this.title.innerHTML = `
            <div class="jk-img-info-title">
                <sl-badge variant="neutral">
                        ${m.nodeTitle} - (#${m.nodeId})
                </sl-badge>
            </div>
              <div class="jk-img-info-time">
                <sl-badge variant="success"> 
                    ${(m.execTimeMs / 1e3).toFixed(2)}s
                </sl-badge>
            </div>
        `;
    this.title.classList.add("jk-img-info-wrapper");
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
  constructor(container, feedBarContainer) {
    this.container = container;
    this.feedBarContainer = feedBarContainer;
    this.initialized = false;
    this.images = [];
    // node title and # => image
    this.imageMap = /* @__PURE__ */ new Map();
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
  //TODO, add ability to toggle which ouputs to view images from based on node title/#
  // add clear button
  // implement right sigght of gallery, on first load if no image there load the first image we get
  // on click go full screen?
  // add grid mode like map does? not sure i care
  get leftPanel() {
    return document.getElementById("jk-gallery-left-panel");
  }
  get rightPanel() {
    return document.getElementById("jk-gallery-right-panel");
  }
  async init() {
    if (!this.initialized) {
      this.initialized = true;
      await this.FeedBar.init();
    }
  }
  async addImage(data) {
    const nodeTitle = `${data.nodeTitle} - (#${data.nodeId})`;
    if (!this.imageMap.has(nodeTitle)) this.imageMap.set(nodeTitle, []);
    this.imageMap.get(nodeTitle).unshift(data);
    const img = await new JKImage(data).init();
    this.images.unshift(img);
    this.leftPanel.prepend(img.getEl());
  }
  async addImages(imgs) {
    for (const i of imgs) {
      await this.addImage(i);
    }
  }
};
export {
  JKImageGallery
};
