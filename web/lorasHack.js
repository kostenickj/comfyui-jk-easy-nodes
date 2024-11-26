var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// src_web/lorasHack.ts
import { TextAreaAutoComplete } from "./common/autocomplete.js";
var require_lorasHack = __commonJS({
  "src_web/lorasHack.ts"() {
    var walkUpListToFindFullLoraPath = (targetNode, startNode) => {
      const path = [];
      let currentNode = startNode;
      while (currentNode !== targetNode && currentNode !== null) {
        if (currentNode instanceof HTMLLIElement) {
          path.unshift(currentNode);
        }
        currentNode = currentNode.parentElement;
      }
      if (currentNode === targetNode) {
        return path;
      } else {
        return [];
      }
    };
    var LoraClickHacker = class {
      constructor() {
        __publicField(this, "modelLibraryButton");
        __publicField(this, "lorasListItemExpander");
        __publicField(this, "lorasButtonExpander");
        __publicField(this, "recurse", (currentEl) => {
          const children = currentEl.querySelectorAll("li");
          children.forEach((li) => {
            const maybeLoraFile = li.querySelector(".tree-leaf");
            if (maybeLoraFile) {
              maybeLoraFile.removeEventListener("click", this.handleLoraClicked);
              maybeLoraFile.addEventListener("click", this.handleLoraClicked);
            } else {
              this.recurse(li);
            }
          });
        });
        __publicField(this, "handleLorasExpanded", (ev) => {
          setTimeout(() => {
            const isExpanded = this.lorasListItemExpander?.ariaExpanded === "true";
            if (isExpanded) {
              setTimeout(() => {
                this.recurse(this.lorasListItemExpander);
              }, 1);
            }
          }, 1);
        });
        __publicField(this, "attachTopLevelListeners", () => {
          this.lorasListItemExpander = document.querySelector('li.p-tree-node[aria-label="loras"]');
          this.lorasButtonExpander = this.lorasListItemExpander?.querySelector("button");
          this.lorasListItemExpander?.removeEventListener("mouseup", this.handleLorasExpanded);
          this.lorasListItemExpander?.addEventListener("mouseup", this.handleLorasExpanded);
          this.lorasButtonExpander?.removeEventListener("mouseup", this.handleLorasExpanded);
          this.lorasButtonExpander?.addEventListener("mouseup", this.handleLorasExpanded);
        });
        this.init();
      }
      handleLoraClicked(ev) {
        const el = this;
        const path = walkUpListToFindFullLoraPath(document.querySelector('li.p-tree-node[aria-label="loras"]'), el);
        const label = path.map((p) => p.ariaLabel);
        const loraPath = label.join("/").toLowerCase().replace(".safetensors", "");
        const lorasDict = TextAreaAutoComplete.groups["jk-nodes.loras"];
        const found = Object.values(lorasDict).find((l) => {
          const meta = l.meta;
          const outputName = meta?.ss_output_name;
          const modelName = meta?.ss_sd_model_name;
          if (outputName && outputName.toLowerCase() === el.innerText.toLowerCase()) {
            console.log("matched output name");
            return true;
          }
          const baseLname = l?.lora_name?.toLowerCase() ?? "";
          const noExt = baseLname.substring(0, baseLname.lastIndexOf("."));
          const lNamePath = baseLname.replaceAll("//", "/").replaceAll("\\", "/");
          const lNamePathNoExt = noExt.replaceAll("//", "/").replaceAll("\\", "/");
          if ([baseLname, noExt, lNamePath, lNamePathNoExt].includes(loraPath)) {
            console.log("matched lora path");
            return true;
          }
          if (modelName && modelName.toLowerCase() === el.innerText.toLowerCase()) {
            console.log("last resort matched model name");
            return true;
          } else if (outputName && outputName.match(el.innerText.toLowerCase())) {
            console.log("output name match resort match");
            return true;
          } else if (baseLname?.toLowerCase()?.match(el.innerText.toLowerCase())) {
            console.log("REALLY resort match, probably wrong...");
            return true;
          } else {
            return false;
          }
        });
        if (found) {
          found.info?.();
        }
      }
      init() {
        const interval = setInterval(() => {
          this.modelLibraryButton = document.querySelector('button[aria-label="Model Library (m)"]');
          if (this.modelLibraryButton) {
            clearInterval(interval);
            this.modelLibraryButton.addEventListener("click", (ev) => {
              console.log("model library toggled");
              this.attachTopLevelListeners();
            });
          }
        }, 100);
      }
    };
    new LoraClickHacker();
  }
});
export default require_lorasHack();
