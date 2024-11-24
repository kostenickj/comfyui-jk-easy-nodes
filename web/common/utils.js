// src_web/common/utils.ts
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
export {
  findKeyValueRecursive,
  getElementCSSVariables
};
