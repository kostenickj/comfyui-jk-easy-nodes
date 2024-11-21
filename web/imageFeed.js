"use strict";
import { api } from "../../../scripts/api.js";
import { app } from "../../../scripts/app.js";
import { $el } from "../../../scripts/ui.js";
let feedWindow = null;
const toggleWindow = () => {
  window.onmessage = (e) => {
    console.log(e, "received");
  };
  if (feedWindow) {
    feedWindow.close();
    feedWindow = null;
  } else {
    feedWindow = window.open(
      `/extensions/comfyui-jk-easy-nodes/jk-image-window.html`,
      `_blank`,
      `width=1280,height=720,location=no,toolbar=no,menubar=no`
    );
  }
  setInterval(() => {
    feedWindow?.postMessage("test message!!!");
  }, 1e3);
};
app.registerExtension({
  name: "jk.ImageFeed",
  async setup() {
    const seenImages = /* @__PURE__ */ new Map();
    const showMenuButton = new (await import("../../../scripts/ui/components/button.js")).ComfyButton({
      icon: "image-multiple",
      action: () => toggleWindow(),
      tooltip: "Toggle Image Window",
      content: "Toggle Image Feed Window"
    });
    showMenuButton.enabled = true;
    showMenuButton.element.style.display = "block";
    app.menu.settingsGroup.append(showMenuButton);
    app.menu?.settingsGroup.element.before(showMenuButton.element);
    const imageFeed = $el("div.jk-image-feed");
    const imageList = $el("div.jk-image-feed-list");
    function addImageToFeed(href) {
      const method = "prepend";
      imageList[method](
        $el("div", [
          $el(
            "a",
            {
              target: "_blank",
              href,
              onclick: (e) => {
                const imgs = [...imageList.querySelectorAll("img")].map((img) => img.getAttribute("src"));
                e.preventDefault();
              }
            },
            [$el("img", { src: href })]
          )
        ])
      );
    }
    window.dispatchEvent(new Event("resize"));
    api.addEventListener("executed", ({ detail }) => {
      if (feedWindow && detail?.output?.images) {
        if (detail.node?.includes?.(":")) {
          const n = app.graph.getNodeById(detail.node.split(":")[0]);
          if (n?.getInnerNodes) return;
        }
        for (const src of detail.output.images) {
          const href = `./view?filename=${encodeURIComponent(src.filename)}&type=${src.type}&
					subfolder=${encodeURIComponent(src.subfolder)}&t=${+/* @__PURE__ */ new Date()}`;
          const deduplicateFeed = { value: 0 };
          if (deduplicateFeed.value > 0) {
            const fingerprint = JSON.stringify({ filename: src.filename, type: src.type, subfolder: src.subfolder });
            if (seenImages.has(fingerprint)) {
            } else {
              seenImages.set(fingerprint, true);
              let img = $el("img", { src: href });
              img.onerror = () => {
                addImageToFeed(href);
              };
              img.onload = () => {
                let imgCanvas = document.createElement("canvas");
                let imgScalar = deduplicateFeed.value;
                imgCanvas.width = imgScalar * img.width;
                imgCanvas.height = imgScalar * img.height;
                let imgContext = imgCanvas.getContext("2d");
                imgContext.drawImage(img, 0, 0, imgCanvas.width, imgCanvas.height);
                const data = imgContext.getImageData(0, 0, imgCanvas.width, imgCanvas.height);
                let hash = 0;
                for (const b of data.data) {
                  hash = (hash << 5) - hash + b;
                }
                if (seenImages.has(hash)) {
                } else {
                  seenImages.set(hash, true);
                  addImageToFeed(href);
                }
              };
            }
          } else {
            addImageToFeed(href);
          }
        }
      }
    });
  }
});
