export const getElementCSSVariables = (element = document.documentElement) => {
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

export const findKeyValueRecursive = <K extends string>(obj: any, target: K): Record<K, any> | null => {
    const recurse = (current: any): any => {
        if (typeof current !== 'object' || current === null) {
            return null;
        }

        if (Array.isArray(current)) {
            for (const item of current) {
                const result = recurse(item);
                if (result) return result;
            }
            // Key not found in this array
            return null;
        }

        for (const [key, value] of Object.entries(current)) {
            if (key === target) {
                return { [key]: value };
            }
            const result = recurse(value);
            if (result) return result;
        }

        return null; // Key not found at this level
    };

    return recurse(obj);
};
