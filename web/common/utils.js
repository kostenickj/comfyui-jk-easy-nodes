// src_web/common/utils.ts
import { $el } from "../../../../scripts/ui.js";
function addStylesheet(url) {
  if (url.endsWith(".js")) {
    url = url.substr(0, url.length - 2) + "css";
  }
  $el("link", {
    parent: document.head,
    rel: "stylesheet",
    type: "text/css",
    href: url.startsWith("http") ? url : getUrl(url)
  });
}
function getUrl(path, baseUrl) {
  if (baseUrl) {
    return new URL(path, baseUrl).toString();
  } else {
    return new URL("../" + path, import.meta.url).toString();
  }
}
var getElementCSSVariables = (element = document.documentElement) => {
  const rootCssVariables = Array.from(document.styleSheets).flatMap((styleSheet) => Array.from(styleSheet.cssRules)).filter((cssRule) => cssRule instanceof CSSStyleRule && cssRule.selectorText === ":root").flatMap((cssRule) => Array.from(cssRule.style)).filter((style) => style.startsWith("--"));
  const elStyles = window.getComputedStyle(element);
  const cssVars = {};
  for (const key of rootCssVariables) {
    let value = elStyles.getPropertyValue(key);
    if (value) {
      cssVars[key] = value;
    }
  }
  return cssVars;
};
export {
  addStylesheet,
  getElementCSSVariables,
  getUrl
};
