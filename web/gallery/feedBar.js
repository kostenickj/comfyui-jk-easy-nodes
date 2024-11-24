// src_web/gallery/feedBar.ts
var FeedBarEvents = {
  "feed-clear": "feed-clear"
};
var JKFeedBar = class extends EventTarget {
  constructor(el) {
    super();
    this.el = el;
    this.el.classList.add("comfyui-menu", "flex", "items-center");
    this.buttonGroup = document.createElement("div");
    this.el.append(this.buttonGroup);
    this.buttonGroup.classList.add("comfyui-button-group");
  }
  async init() {
    const ComfyButton = (await import("../../../scripts/ui/components/button.js")).ComfyButton;
    const clearFeedButton = new ComfyButton({
      icon: "nuke",
      action: () => {
        this.dispatchEvent(new Event(FeedBarEvents["feed-clear"]));
      },
      tooltip: "Clear the feed",
      content: "Clear Feed"
    });
    this.buttonGroup.append(clearFeedButton.element);
  }
};
export {
  FeedBarEvents,
  JKFeedBar
};
