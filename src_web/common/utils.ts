// @ts-ignore
import { $el } from '../../../../scripts/ui.js';

export function addStylesheet(url: string) {
    if (url.endsWith('.js')) {
        url = url.substr(0, url.length - 2) + 'css';
    }
    $el('link', {
        parent: document.head,
        rel: 'stylesheet',
        type: 'text/css',
        href: url.startsWith('http') ? url : getUrl(url)
    });
}

export function getUrl(path: string, baseUrl?: string) {
    if (baseUrl) {
        return new URL(path, baseUrl).toString();
    } else {
        return new URL('../' + path, import.meta.url).toString();
    }
}

export const getElementCSSVariables = (element = document.body) => {
    const rootCssVariables: string[] = Array.from(document.styleSheets)
        .flatMap((styleSheet: CSSStyleSheet) => Array.from(styleSheet.cssRules))
        .filter((cssRule: CSSRule): cssRule is CSSStyleRule => cssRule instanceof CSSStyleRule && cssRule.selectorText === ':root')
        .flatMap((cssRule: CSSStyleRule) => Array.from(cssRule.style))
        .filter((style: string) => style.startsWith('--'));

    const elStyles = window.getComputedStyle(element);
    const cssVars: Record<string, string> = {};
    for (const key of rootCssVariables) {
        let value = elStyles.getPropertyValue(key);
        if (value) {
            cssVars[key] = value;
        }
    }
    return cssVars;
};
