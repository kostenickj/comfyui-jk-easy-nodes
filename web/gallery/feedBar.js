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
export {
  JKFeedBar
};
