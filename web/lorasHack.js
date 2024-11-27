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
    var logDebug = false;
    var _LoraClickHacker = class _LoraClickHacker {
      constructor() {
        __publicField(this, "modelLibraryButton");
        __publicField(this, "lorasListItemExpander");
        __publicField(this, "lorasButtonExpander");
        __publicField(this, "recurse", (currentEl) => {
          const children = currentEl.querySelectorAll("li");
          children.forEach((li) => {
            const maybeLoraFile = li.querySelector(".tree-leaf");
            if (maybeLoraFile) {
              if (logDebug) console.log("found lora", maybeLoraFile, maybeLoraFile.innerText);
              maybeLoraFile.removeEventListener("contextmenu", this.handleLoraClicked);
              maybeLoraFile.addEventListener("contextmenu", this.handleLoraClicked);
            } else {
              this.recurse(li);
            }
          });
        });
        __publicField(this, "handleLorasExpanded", (ev) => {
          setTimeout(() => {
            const isExpanded = this.lorasListItemExpander?.ariaExpanded === "true";
            if (logDebug) console.log(`loras bar bar is ${isExpanded ? "expanded" : "closed"}`);
            setTimeout(() => {
              this.recurse(this.lorasListItemExpander);
            }, 1);
          }, 1);
        });
        __publicField(this, "tryAttachTopLevelListeners", () => {
          this.lorasListItemExpander = document.querySelector('li.p-tree-node[aria-label="loras"]');
          this.lorasButtonExpander = this.lorasListItemExpander?.querySelector("button");
          this.lorasListItemExpander?.removeEventListener("mouseup", this.handleLorasExpanded);
          this.lorasListItemExpander?.addEventListener("mouseup", this.handleLorasExpanded);
          this.lorasButtonExpander?.removeEventListener("mouseup", this.handleLorasExpanded);
          this.lorasButtonExpander?.addEventListener("mouseup", this.handleLorasExpanded);
        });
        this.init();
        TextAreaAutoComplete.addEventListener("loras-refreshed", () => {
          if (logDebug) console.log("loras reloaded");
          _LoraClickHacker.loraMapCache = /* @__PURE__ */ new Map();
        });
      }
      handleLoraClicked(ev) {
        if (!TextAreaAutoComplete.enabled) return;
        const el = this;
        ev.preventDefault();
        if (logDebug) console.log("lora clicked", el.innerText);
        const lorasInfoDict = TextAreaAutoComplete.groups["jk-nodes.loras"];
        const cachedInfoKey = _LoraClickHacker.loraMapCache.get(el.innerText);
        if (cachedInfoKey) {
          const info = lorasInfoDict[cachedInfoKey];
          if (info) {
            if (logDebug) console.log(`found cached lora with ${cachedInfoKey}`);
            info.info?.();
            return;
          }
          if (logDebug) console.log(`no lora found with ${cachedInfoKey}`);
        } else {
          if (logDebug) console.log(`no cached lora key found with ${el.innerText}`);
        }
        const path = _LoraClickHacker.walkUpListToFindFullLoraPath(document.querySelector('li.p-tree-node[aria-label="loras"]'), el);
        const label = path.map((p) => p.ariaLabel);
        const loraPath = label.join("/").toLowerCase().replace(".safetensors", "");
        const found = Object.values(lorasInfoDict).find((l) => {
          const meta = l.meta;
          const outputName = meta?.ss_output_name;
          const modelName = meta?.ss_sd_model_name;
          if (outputName && outputName.toLowerCase() === el.innerText.toLowerCase()) {
            if (logDebug) console.log("matched output name");
            return true;
          }
          const baseLname = l?.lora_name?.toLowerCase() ?? "";
          const noExt = baseLname.substring(0, baseLname.lastIndexOf("."));
          const lNamePath = baseLname.replaceAll("//", "/").replaceAll("\\", "/");
          const lNamePathNoExt = noExt.replaceAll("//", "/").replaceAll("\\", "/");
          if ([baseLname, noExt, lNamePath, lNamePathNoExt].includes(loraPath)) {
            if (logDebug) console.log("matched lora path");
            return true;
          }
          if (modelName && modelName.toLowerCase() === el.innerText.toLowerCase()) {
            if (logDebug) console.log("last resort matched model name");
            return true;
          } else if (outputName && outputName.match(el.innerText.toLowerCase())) {
            if (logDebug) console.log("output name match resort match");
            return true;
          } else if (baseLname?.toLowerCase()?.match(el.innerText.toLowerCase())) {
            if (logDebug) console.log("REALLY resort match, probably wrong...");
            return true;
          } else {
            return false;
          }
        });
        if (found) {
          _LoraClickHacker.loraMapCache.set(el.innerText, found.text);
          found.info?.();
        }
      }
      init() {
        const interval = setInterval(() => {
          this.modelLibraryButton = document.querySelector('button[aria-label="Model Library (m)"]');
          if (this.modelLibraryButton) {
            clearInterval(interval);
            this.modelLibraryButton.addEventListener("click", (ev) => {
              if (logDebug) console.log("model library toggled");
              this.tryAttachTopLevelListeners();
            });
          }
        }, 100);
      }
    };
    // lora name from DOM -> lora key in textautocomplete loras
    __publicField(_LoraClickHacker, "loraMapCache", /* @__PURE__ */ new Map());
    __publicField(_LoraClickHacker, "walkUpListToFindFullLoraPath", (targetNode, startNode) => {
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
    });
    var LoraClickHacker = _LoraClickHacker;
    new LoraClickHacker();
  }
});
export default require_lorasHack();
