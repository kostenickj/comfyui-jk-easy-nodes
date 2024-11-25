// src_web/gallery/feedBar.ts
var EFeedBarEvents = /* @__PURE__ */ ((EFeedBarEvents2) => {
  EFeedBarEvents2["feed-clear"] = "feed-clear";
  EFeedBarEvents2["check-change"] = "check-change";
  EFeedBarEvents2["feed-mode"] = "feed-mode";
  return EFeedBarEvents2;
})(EFeedBarEvents || {});
var EFeedMode = /* @__PURE__ */ ((EFeedMode2) => {
  EFeedMode2["feed"] = "feed";
  EFeedMode2["grid"] = "grid";
  return EFeedMode2;
})(EFeedMode || {});
var FeedBarEvent = class extends CustomEvent {
  constructor(eventType, payload) {
    super(eventType, { detail: payload });
  }
};
var JKFeedBar = class extends EventTarget {
  constructor(el) {
    super();
    this.el = el;
    this.currentMode = "feed" /* feed */;
    this._checkedItems = /* @__PURE__ */ new Map();
    this.el.classList.add("comfyui-menu", "flex", "items-center", "justify-start");
    this.rightButtonGroup = document.createElement("div");
    this.el.append(this.rightButtonGroup);
    this.rightButtonGroup.classList.add("comfyui-button-group", "right");
    this.leftButtonGroup = document.createElement("div");
    this.el.append(this.leftButtonGroup);
    this.leftButtonGroup.classList.add("comfyui-button-group", "center");
    this.checkboxMenuWrapper = document.createElement("div");
    this.checkboxMenuWrapper.classList.add("jk-checkbox-wrapper");
    this.checkboxMenuWrapper.innerHTML = `
            <sl-dropdown id="jk-checkbox-menu-dropdown" stay-open-on-select="true">
            <sl-button title="Toggle which images node to show" class="checkbox-menu-trigger" size="small" variant="neutral" slot="trigger" caret>Toggle Node Visibility</sl-button>
            <sl-menu id="jk-checkbox-menu-menu">           
            </sl-menu>
            </sl-dropdown>
            <style>
                sl-button.checkbox-menu-trigger::part(base) { 
                    font-size:16px;
                    background-color: var(--comfy-menu-bg);
                    min-width: 250px;
                    text-align:left;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }
                    sl-button.checkbox-menu-trigger::part(caret) { 
                        margin-left: auto;
                    }
                    sl-menu{
                        background-color: var(--comfy-menu-bg);
                        min-width: 250px;
                        color:  var(--fg-color);
                        sl-menu-item::part(base){
                            color:  var(--fg-color);
                            background-color: var(--comfy-menu-bg);
                        }
                        sl-menu-item::part(base):hover{
                            background-color: var(--primary-hover-bg);
                        }
                    }
            </style>
        `;
    this.el.prepend(this.checkboxMenuWrapper);
    this.checkboxMenuDropdown = document.getElementById("jk-checkbox-menu-dropdown");
    this.checkBoxMenuMenu = document.getElementById("jk-checkbox-menu-menu");
    this.checkBoxMenuMenu.addEventListener("sl-select", (ev) => {
      const item = ev?.detail?.item;
      this._checkedItems.set(item.value, item.checked);
      this.dispatchEvent(new FeedBarEvent("check-change" /* check-change */, {}));
    });
  }
  get checkedItems() {
    return this._checkedItems;
  }
  createMenuItem(item, isChecked) {
    const menuItem = document.createElement("sl-menu-item");
    menuItem.type = "checkbox";
    menuItem.value = item;
    menuItem.innerText = item;
    menuItem.checked = isChecked;
    return menuItem;
  }
  addCheckboxOptionIfNeeded(item, isChecked) {
    let needsInsert = false;
    if (!this.checkedItems.has(item)) {
      needsInsert = true;
    }
    this.checkedItems.set(item, isChecked);
    if (needsInsert) {
      const menuItem = this.createMenuItem(item, isChecked);
      this.checkBoxMenuMenu.appendChild(menuItem);
    }
  }
  updateCheckboxOptions(items, checkAll) {
    this.checkBoxMenuMenu.innerHTML = "";
    items.forEach((x) => {
      const menuItem = this.createMenuItem(x, checkAll || this.checkedItems.get(x) ? true : false);
      this.checkBoxMenuMenu.appendChild(menuItem);
    });
    if (checkAll) {
      this._checkedItems.clear();
      items.forEach((x) => {
        this._checkedItems.set(x, true);
      });
    }
  }
  async init() {
    const ComfyButton = (await import("../../../scripts/ui/components/button.js")).ComfyButton;
    const clearFeedButton = new ComfyButton({
      icon: "nuke",
      action: () => {
        this.dispatchEvent(new FeedBarEvent("feed-clear" /* feed-clear */, {}));
      },
      tooltip: "Clear the feed",
      content: "Clear Feed"
    });
    const feedModeButton = new ComfyButton({
      icon: "image-frame",
      action: () => {
        if (this.currentMode !== "feed" /* feed */) {
          this.currentMode = "feed" /* feed */;
          feedModeButton.element.classList.add("primary");
          gridModeButton.element.classList.remove("primary");
          this.dispatchEvent(new FeedBarEvent("feed-mode" /* feed-mode */, "feed" /* feed */));
        }
      },
      tooltip: "Feed Display Node",
      content: "Feed"
    });
    feedModeButton.element.classList.add("primary");
    const gridModeButton = new ComfyButton({
      icon: "view-grid",
      action: () => {
        if (this.currentMode !== "grid" /* grid */) {
          this.currentMode = "grid" /* grid */;
          gridModeButton.element.classList.add("primary");
          feedModeButton.element.classList.remove("primary");
          this.dispatchEvent(new FeedBarEvent("feed-mode" /* feed-mode */, "grid" /* grid */));
        }
      },
      tooltip: "Grid Display Mode",
      content: "Grid"
    });
    this.rightButtonGroup.append(clearFeedButton.element);
    this.leftButtonGroup.append(feedModeButton.element, gridModeButton.element);
  }
};
export {
  EFeedBarEvents,
  EFeedMode,
  FeedBarEvent,
  JKFeedBar
};
