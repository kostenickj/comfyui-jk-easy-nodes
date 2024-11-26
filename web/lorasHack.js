var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

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
        this.recurse = (currentEl) => {
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
        };
        this.handleLorasExpanded = (ev) => {
          setTimeout(() => {
            const isExpanded = this.lorasListItemExpander?.ariaExpanded === "true";
            if (isExpanded) {
              setTimeout(() => {
                this.recurse(this.lorasListItemExpander);
              }, 1);
            }
          }, 1);
        };
        this.attachTopLevelListeners = () => {
          this.lorasListItemExpander = document.querySelector('li.p-tree-node[aria-label="loras"]');
          this.lorasButtonExpander = this.lorasListItemExpander?.querySelector("button");
          this.lorasListItemExpander?.removeEventListener("mouseup", this.handleLorasExpanded);
          this.lorasListItemExpander?.addEventListener("mouseup", this.handleLorasExpanded);
          this.lorasButtonExpander?.removeEventListener("mouseup", this.handleLorasExpanded);
          this.lorasButtonExpander?.addEventListener("mouseup", this.handleLorasExpanded);
        };
        this.init();
      }
      handleLoraClicked(ev) {
        const el = this;
        console.log("lora clicked", el.innerText);
        const path = walkUpListToFindFullLoraPath(document.querySelector('li.p-tree-node[aria-label="loras"]'), el);
        console.log(path);
        const label = path.map((p) => p.ariaLabel);
        const loraPath = label.join("/");
        console.log(loraPath);
        const lorasDict = TextAreaAutoComplete.groups["jk-nodes.loras"];
        const found = Object.values(lorasDict).find((l) => {
          const meta = l.meta;
          if (meta) {
            console.log(meta);
            if (meta?.ss_sd_model_name?.toLowerCase().match(el.innerText.toLowerCase())) {
              return true;
            }
          }
          const lName = l.lora_name?.substring(0, l.lora_name.lastIndexOf(".")) || l.lora_name;
          if (lName?.toLowerCase()?.match(el.innerText.toLowerCase())) {
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
