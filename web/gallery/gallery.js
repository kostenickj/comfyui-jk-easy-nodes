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

// src_web/common/utils.ts
var findKeyValueRecursive = (obj, target) => {
  const recurse = (current) => {
    if (typeof current !== "object" || current === null) {
      return null;
    }
    if (Array.isArray(current)) {
      for (const item of current) {
        const result = recurse(item);
        if (result) return result;
      }
      return null;
    }
    for (const [key, value] of Object.entries(current)) {
      if (key === target) {
        return { [key]: value };
      }
      const result = recurse(value);
      if (result) return result;
    }
    return null;
  };
  return recurse(obj);
};

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/assets/icons/eye-fill.svg
var eye_fill_default = "../eye-fill-RBTRTZO3.svg";

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/assets/icons/plus-square.svg
var plus_square_default = "../plus-square-QC6YQSQG.svg";

// src_web/gallery/gallery.ts
console.log(eye_fill_default);
var JKImage = class {
  constructor(m, showInfo, showOpacityOverlay, clickedCallback) {
    this.m = m;
    this.clickedCallback = clickedCallback;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("jk-img-wrapper");
    if (showOpacityOverlay) {
      this.opacityOverlay = document.createElement("div");
      this.opacityOverlay.innerHTML = `<sl-icon src="${eye_fill_default}"></sl-icon>`;
      this.opacityOverlay.classList.add("jk-img-hover");
      this.wrapper.append(this.opacityOverlay);
    }
    this.spinner = document.createElement("div");
    this.spinner.innerHTML = `<div class="jk-spinner-wrap"><sl-spinner style="font-size: 3rem; --track-width: 3px; --track-color: var(--border-color); --indicator-color: var(--p-progressspinner-color-2)"></sl-spinner></div>`;
    this.wrapper.append(this.spinner);
    if (showInfo) {
      this.info = document.createElement("div");
      this.info.textContent = `${m.nodeTitle} - (#${m.nodeId})`;
      this.info.innerHTML = `
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
      this.info.classList.add("jk-img-info-wrapper");
      this.wrapper.append(this.info);
    }
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
    this.img.onclick = (ev) => {
      this.clickedCallback?.(this.m);
    };
    this.img.classList.add("jk-img");
    this.wrapper.appendChild(this.img);
    this.wrapper.removeChild(this.spinner);
    return this;
  }
  getEl() {
    return this.wrapper;
  }
};
var JKRightPanelImage = class {
  constructor(m) {
    this.m = m;
    this.container = document.createElement("div");
    this.container.classList.add("jk-rightpanel-container");
    this.title = document.createElement("div");
    this.title.classList.add("jk-rightpanel-title");
    this.info = document.createElement("div");
    this.info.classList.add("jk-rightpanel-info");
  }
  getEl() {
    return this.container;
  }
  async tryLoadMetaData() {
    try {
      const blob = await fetch(this.m.href).then((r) => r.blob());
      const metadata = await window.comfyAPI.pnginfo.getPngMetadata(blob);
      this.promptMetadata = JSON.parse(metadata?.prompt);
      const seed = findKeyValueRecursive(this.promptMetadata, "seed");
      if (typeof seed?.seed === "number") {
        this.seed = seed.seed;
        const seedDisplay = document.createElement("div");
        seedDisplay.innerText = `Seed: ${this.seed}`;
        this.title.appendChild(seedDisplay);
      }
      this.info.innerHTML = `
            <sl-details summary="View Prompt Data">
                    <sl-icon src=${plus_square_default} slot="expand-icon"></sl-icon>
                     <sl-icon name="${plus_square_default}" slot="collapse-icon"></sl-icon>
                <pre>${JSON.stringify(this.promptMetadata, void 0, 4)}</pre>
            </sl-details>
        `;
    } catch (err) {
      console.error("failed to get metadata", err);
    }
  }
  async init() {
    this.container.appendChild(this.title);
    this.title.innerHTML = `
        <div>
            ${this.m.nodeTitle} - (#${this.m.nodeId})
        </div>
         <div>
            filename: ${this.m.fileName}
        </div>
        `;
    this.img = await new JKImage(this.m, false, true).init();
    this.container.appendChild(this.img.getEl());
    this.container.appendChild(this.info);
    this.tryLoadMetaData();
    return this;
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
    this.handleImageClicked = (data) => {
      this.selectImage(data);
    };
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
                </div>
            </sl-split-panel>
        `;
    this.FeedBar = new JKFeedBar(this.feedBarContainer);
  }
  //TODO, add ability to toggle which ouputs to view images from based on node title/#
  // add clear button
  // implement right sigght of gallery, on first load if no image there load the first image we get
  // on click go full screen
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
  async selectImage(data) {
    this.selectedImage = await new JKRightPanelImage(data).init();
    this.rightPanel.replaceChildren(this.selectedImage.getEl());
  }
  async addImage(data) {
    const nodeTitle = `${data.nodeTitle} - (#${data.nodeId})`;
    if (!this.imageMap.has(nodeTitle)) this.imageMap.set(nodeTitle, []);
    this.imageMap.get(nodeTitle).unshift(data);
    const img = await new JKImage(data, true, false, this.handleImageClicked).init();
    this.images.unshift(img);
    this.leftPanel.prepend(img.getEl());
  }
  async addImages(imgs) {
    if (!imgs) return;
    for (const i of imgs) {
      await this.addImage(i);
    }
    if (!this.selectedImage && imgs.length) {
      this.selectImage(imgs[0]);
    }
  }
};
export {
  JKImageGallery
};
