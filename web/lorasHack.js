var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src_web/lorasHack.ts
import { TextAreaAutoComplete } from "./common/autocomplete.js";
var require_lorasHack = __commonJS({
  "src_web/lorasHack.ts"() {
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
        const lorasDict = TextAreaAutoComplete.groups["jk-nodes.loras"];
        const found = Object.values(lorasDict).find((l) => {
          const lName = l.lora_name?.substring(0, l.lora_name.lastIndexOf(".")) || l.lora_name;
          return lName?.toLowerCase()?.match(el.innerText.toLowerCase());
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
