var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TextAreaCaretHelper_instances, _TextAreaCaretHelper_calculateElementOffset, _TextAreaCaretHelper_isDigit, _TextAreaCaretHelper_getLineHeightPx, _TextAreaCaretHelper_calculateLineHeightPx, _TextAreaCaretHelper_getElScroll, _TextAreaCaretHelper_getCursorPosition, _TextAreaAutoComplete_instances, _a, _TextAreaAutoComplete_setup, _TextAreaAutoComplete_keyDown, _TextAreaAutoComplete_keyPress, _TextAreaAutoComplete_keyUp, _TextAreaAutoComplete_setSelected, _TextAreaAutoComplete_insertItem, _TextAreaAutoComplete_getFilteredWords, _TextAreaAutoComplete_update, _TextAreaAutoComplete_escapeParentheses, _TextAreaAutoComplete_hide;
import { $el } from "../../../../scripts/ui.js";
import { addStylesheet } from "./utils.js";
addStylesheet(import.meta.url);
const getCaretCoordinates = (function () {
    var properties = [
        "direction",
        "boxSizing",
        "width",
        "height",
        "overflowX",
        "overflowY",
        "borderTopWidth",
        "borderRightWidth",
        "borderBottomWidth",
        "borderLeftWidth",
        "borderStyle",
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "fontStyle",
        "fontVariant",
        "fontWeight",
        "fontStretch",
        "fontSize",
        "fontSizeAdjust",
        "lineHeight",
        "fontFamily",
        "textAlign",
        "textTransform",
        "textIndent",
        "textDecoration",
        "letterSpacing",
        "wordSpacing",
        "tabSize",
        "MozTabSize",
    ];
    var isBrowser = typeof window !== "undefined";
    var isFirefox = isBrowser && window.mozInnerScreenX != null;
    return function getCaretCoordinates(element, position, options) {
        if (!isBrowser) {
            throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");
        }
        var debug = (options && options.debug) || false;
        if (debug) {
            var el = document.querySelector("#input-textarea-caret-position-mirror-div");
            if (el)
                el.parentNode.removeChild(el);
        }
        var div = document.createElement("div");
        div.id = "input-textarea-caret-position-mirror-div";
        document.body.appendChild(div);
        var style = div.style;
        var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;
        var isInput = element.nodeName === "INPUT";
        style.whiteSpace = "pre-wrap";
        if (!isInput)
            style.wordWrap = "break-word";
        style.position = "absolute";
        if (!debug)
            style.visibility = "hidden";
        properties.forEach(function (prop) {
            if (isInput && prop === "lineHeight") {
                if (computed.boxSizing === "border-box") {
                    var height = parseInt(computed.height);
                    var outerHeight = parseInt(computed.paddingTop) +
                        parseInt(computed.paddingBottom) +
                        parseInt(computed.borderTopWidth) +
                        parseInt(computed.borderBottomWidth);
                    var targetHeight = outerHeight + parseInt(computed.lineHeight);
                    if (height > targetHeight) {
                        style.lineHeight = height - outerHeight + "px";
                    }
                    else if (height === targetHeight) {
                        style.lineHeight = computed.lineHeight;
                    }
                    else {
                        style.lineHeight = 0;
                    }
                }
                else {
                    style.lineHeight = computed.height;
                }
            }
            else {
                style[prop] = computed[prop];
            }
        });
        if (isFirefox) {
            if (element.scrollHeight > parseInt(computed.height))
                style.overflowY = "scroll";
        }
        else {
            style.overflow = "hidden";
        }
        div.textContent = element.value.substring(0, position);
        if (isInput)
            div.textContent = div.textContent.replace(/\s/g, "\u00a0");
        var span = document.createElement("span");
        span.textContent = element.value.substring(position) || ".";
        div.appendChild(span);
        var coordinates = {
            top: span.offsetTop + parseInt(computed["borderTopWidth"]),
            left: span.offsetLeft + parseInt(computed["borderLeftWidth"]),
            height: parseInt(computed["lineHeight"]),
        };
        if (debug) {
            span.style.backgroundColor = "#aaa";
        }
        else {
            document.body.removeChild(div);
        }
        return coordinates;
    };
})();
const CHAR_CODE_ZERO = "0".charCodeAt(0);
const CHAR_CODE_NINE = "9".charCodeAt(0);
class TextAreaCaretHelper {
    constructor(el, getScale) {
        _TextAreaCaretHelper_instances.add(this);
        this.el = el;
        this.getScale = getScale;
    }
    getCursorOffset() {
        const scale = this.getScale();
        const elOffset = __classPrivateFieldGet(this, _TextAreaCaretHelper_instances, "m", _TextAreaCaretHelper_calculateElementOffset).call(this);
        const elScroll = __classPrivateFieldGet(this, _TextAreaCaretHelper_instances, "m", _TextAreaCaretHelper_getElScroll).call(this);
        const cursorPosition = __classPrivateFieldGet(this, _TextAreaCaretHelper_instances, "m", _TextAreaCaretHelper_getCursorPosition).call(this);
        const lineHeight = __classPrivateFieldGet(this, _TextAreaCaretHelper_instances, "m", _TextAreaCaretHelper_getLineHeightPx).call(this);
        const top = elOffset.top - (elScroll.top * scale) + (cursorPosition.top + lineHeight) * scale;
        const left = elOffset.left - elScroll.left + cursorPosition.left;
        const clientTop = this.el.getBoundingClientRect().top;
        if (this.el.dir !== "rtl") {
            return { top, left, lineHeight, clientTop };
        }
        else {
            const right = document.documentElement ? document.documentElement.clientWidth - left : 0;
            return { top, right, lineHeight, clientTop };
        }
    }
    getBeforeCursor() {
        return this.el.selectionStart !== this.el.selectionEnd ? null : this.el.value.substring(0, this.el.selectionEnd);
    }
    getAfterCursor() {
        return this.el.value.substring(this.el.selectionEnd);
    }
    insertAtCursor(value, offset, finalOffset) {
        if (this.el.selectionStart != null) {
            const startPos = this.el.selectionStart;
            const endPos = this.el.selectionEnd;
            this.el.selectionStart = this.el.selectionStart + offset;
            let pasted = true;
            try {
                if (!document.execCommand("insertText", false, value)) {
                    pasted = false;
                }
            }
            catch (e) {
                console.error("Error caught during execCommand:", e);
                pasted = false;
            }
            if (!pasted) {
                console.error("execCommand unsuccessful; not supported. Adding text manually, no undo support.");
                textarea.setRangeText(modifiedText, this.el.selectionStart, this.el.selectionEnd, 'end');
            }
            this.el.selectionEnd = this.el.selectionStart = startPos + value.length + offset + (finalOffset !== null && finalOffset !== void 0 ? finalOffset : 0);
        }
        else {
            let pasted = true;
            try {
                if (!document.execCommand("insertText", false, value)) {
                    pasted = false;
                }
            }
            catch (e) {
                console.error("Error caught during execCommand:", e);
                pasted = false;
            }
            if (!pasted) {
                console.error("execCommand unsuccessful; not supported. Adding text manually, no undo support.");
                this.el.value += value;
            }
        }
    }
}
_TextAreaCaretHelper_instances = new WeakSet(), _TextAreaCaretHelper_calculateElementOffset = function _TextAreaCaretHelper_calculateElementOffset() {
    const rect = this.el.getBoundingClientRect();
    const owner = this.el.ownerDocument;
    if (owner == null) {
        throw new Error("Given element does not belong to document");
    }
    const { defaultView, documentElement } = owner;
    if (defaultView == null) {
        throw new Error("Given element does not belong to window");
    }
    const offset = {
        top: rect.top + defaultView.pageYOffset,
        left: rect.left + defaultView.pageXOffset,
    };
    if (documentElement) {
        offset.top -= documentElement.clientTop;
        offset.left -= documentElement.clientLeft;
    }
    return offset;
}, _TextAreaCaretHelper_isDigit = function _TextAreaCaretHelper_isDigit(charCode) {
    return CHAR_CODE_ZERO <= charCode && charCode <= CHAR_CODE_NINE;
}, _TextAreaCaretHelper_getLineHeightPx = function _TextAreaCaretHelper_getLineHeightPx() {
    const computedStyle = getComputedStyle(this.el);
    const lineHeight = computedStyle.lineHeight;
    if (__classPrivateFieldGet(this, _TextAreaCaretHelper_instances, "m", _TextAreaCaretHelper_isDigit).call(this, lineHeight.charCodeAt(0))) {
        const floatLineHeight = parseFloat(lineHeight);
        return __classPrivateFieldGet(this, _TextAreaCaretHelper_instances, "m", _TextAreaCaretHelper_isDigit).call(this, lineHeight.charCodeAt(lineHeight.length - 1))
            ? floatLineHeight * parseFloat(computedStyle.fontSize)
            : floatLineHeight;
    }
    return __classPrivateFieldGet(this, _TextAreaCaretHelper_instances, "m", _TextAreaCaretHelper_calculateLineHeightPx).call(this, this.el.nodeName, computedStyle);
}, _TextAreaCaretHelper_calculateLineHeightPx = function _TextAreaCaretHelper_calculateLineHeightPx(nodeName, computedStyle) {
    const body = document.body;
    if (!body)
        return 0;
    const tempNode = document.createElement(nodeName);
    tempNode.innerHTML = "&nbsp;";
    Object.assign(tempNode.style, {
        fontSize: computedStyle.fontSize,
        fontFamily: computedStyle.fontFamily,
        padding: "0",
        position: "absolute",
    });
    body.appendChild(tempNode);
    if (tempNode instanceof HTMLTextAreaElement) {
        tempNode.rows = 1;
    }
    const height = tempNode.offsetHeight;
    body.removeChild(tempNode);
    return height;
}, _TextAreaCaretHelper_getElScroll = function _TextAreaCaretHelper_getElScroll() {
    return { top: this.el.scrollTop, left: this.el.scrollLeft };
}, _TextAreaCaretHelper_getCursorPosition = function _TextAreaCaretHelper_getCursorPosition() {
    return getCaretCoordinates(this.el, this.el.selectionEnd);
};
export class TextAreaAutoComplete {
    get words() {
        var _b;
        return (_b = this.overrideWords) !== null && _b !== void 0 ? _b : _a.globalWords;
    }
    get separator() {
        var _b;
        return (_b = this.overrideSeparator) !== null && _b !== void 0 ? _b : _a.globalSeparator;
    }
    constructor(el, words = null, separator = null) {
        _TextAreaAutoComplete_instances.add(this);
        this.overrideSeparator = "";
        this.el = el;
        this.helper = new TextAreaCaretHelper(el, () => app.canvas.ds.scale);
        this.dropdown = $el("div.jk-nodes-autocomplete");
        this.overrideWords = words;
        this.overrideSeparator = separator;
        __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_setup).call(this);
    }
    static updateWords(id, words, addGlobal = true) {
        const isUpdate = id in _a.groups;
        _a.groups[id] = words;
        if (addGlobal) {
            _a.globalGroups.add(id);
        }
        if (isUpdate) {
            _a.globalWords = Object.assign({}, ...Object.keys(_a.groups)
                .filter((k) => _a.globalGroups.has(k))
                .map((k) => _a.groups[k]));
        }
        else if (addGlobal) {
            Object.assign(_a.globalWords, words);
        }
    }
}
_a = TextAreaAutoComplete, _TextAreaAutoComplete_instances = new WeakSet(), _TextAreaAutoComplete_setup = function _TextAreaAutoComplete_setup() {
    this.el.addEventListener("keydown", __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_keyDown).bind(this));
    this.el.addEventListener("keypress", __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_keyPress).bind(this));
    this.el.addEventListener("keyup", __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_keyUp).bind(this));
    this.el.addEventListener("click", __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_hide).bind(this));
    this.el.addEventListener("blur", () => setTimeout(() => __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_hide).call(this), 150));
}, _TextAreaAutoComplete_keyDown = function _TextAreaAutoComplete_keyDown(e) {
    if (!_a.enabled)
        return;
    if (this.dropdown.parentElement) {
        switch (e.key) {
            case "ArrowUp":
                e.preventDefault();
                if (this.selected.index) {
                    __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_setSelected).call(this, this.currentWords[this.selected.index - 1].wordInfo);
                }
                else {
                    __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_setSelected).call(this, this.currentWords[this.currentWords.length - 1].wordInfo);
                }
                break;
            case "ArrowDown":
                e.preventDefault();
                if (this.selected.index === this.currentWords.length - 1) {
                    __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_setSelected).call(this, this.currentWords[0].wordInfo);
                }
                else {
                    __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_setSelected).call(this, this.currentWords[this.selected.index + 1].wordInfo);
                }
                break;
            case "Tab":
                if (_a.insertOnTab) {
                    __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_insertItem).call(this);
                    e.preventDefault();
                }
                break;
        }
    }
}, _TextAreaAutoComplete_keyPress = function _TextAreaAutoComplete_keyPress(e) {
    var _b, _c;
    if (!_a.enabled)
        return;
    if (this.dropdown.parentElement) {
        switch (e.key) {
            case "Enter":
                if (!e.ctrlKey) {
                    const isLora = (_c = (_b = this.selected) === null || _b === void 0 ? void 0 : _b.text) === null || _c === void 0 ? void 0 : _c.toLowerCase().startsWith('<lora:');
                    if (_a.insertOnEnter && !isLora) {
                        __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_insertItem).call(this);
                        e.preventDefault();
                    }
                    else if (isLora && typeof this.selected.info === 'function') {
                        this.selected.info();
                    }
                }
                break;
        }
    }
    if (!e.defaultPrevented) {
        __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_update).call(this);
    }
}, _TextAreaAutoComplete_keyUp = function _TextAreaAutoComplete_keyUp(e) {
    if (!_a.enabled)
        return;
    if (this.dropdown.parentElement) {
        switch (e.key) {
            case "Escape":
                e.preventDefault();
                __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_hide).call(this);
                break;
        }
    }
    else if (e.key.length > 1 && e.key != "Delete" && e.key != "Backspace") {
        return;
    }
    if (!e.defaultPrevented) {
        __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_update).call(this);
    }
}, _TextAreaAutoComplete_setSelected = function _TextAreaAutoComplete_setSelected(item) {
    if (this.selected) {
        this.selected.el.classList.remove("jk-nodes-autocomplete-item--selected");
    }
    this.selected = item;
    this.selected.el.classList.add("jk-nodes-autocomplete-item--selected");
}, _TextAreaAutoComplete_insertItem = function _TextAreaAutoComplete_insertItem() {
    if (!this.selected)
        return;
    this.selected.el.click();
}, _TextAreaAutoComplete_getFilteredWords = function _TextAreaAutoComplete_getFilteredWords(term) {
    term = term.toLocaleLowerCase();
    const priorityMatches = [];
    const prefixMatches = [];
    const includesMatches = [];
    const termIsLora = term === null || term === void 0 ? void 0 : term.startsWith('<lora:');
    const termAfterLora = termIsLora ? term.substring(6) : undefined;
    const termIsWildcard = term === null || term === void 0 ? void 0 : term.startsWith('__');
    const termAfterWildcard = termIsWildcard ? term.substring(2) : undefined;
    for (const word of Object.keys(this.words)) {
        const lowerWord = word.toLocaleLowerCase();
        if (lowerWord === term) {
            continue;
        }
        const wordIsWildcard = word.startsWith('__');
        if (wordIsWildcard && !termIsWildcard) {
            continue;
        }
        if (termIsWildcard && !wordIsWildcard) {
            continue;
        }
        const wordIsLora = word.startsWith('<lora:');
        const includeIt = (wordIsLora && termIsLora) || (!wordIsLora && !termIsLora);
        if (!includeIt) {
            continue;
        }
        if (wordIsLora && termIsLora) {
            term = termAfterLora;
        }
        else if (termIsWildcard && wordIsWildcard) {
            term = termAfterWildcard;
        }
        const pos = lowerWord.indexOf(term);
        if (pos === -1) {
            continue;
        }
        const wordInfo = this.words[word];
        if (wordInfo.priority) {
            priorityMatches.push({ pos, wordInfo });
        }
        else if (pos) {
            includesMatches.push({ pos, wordInfo });
        }
        else {
            prefixMatches.push({ pos, wordInfo });
        }
    }
    priorityMatches.sort((a, b) => b.wordInfo.priority - a.wordInfo.priority ||
        a.wordInfo.text.length - b.wordInfo.text.length ||
        a.wordInfo.text.localeCompare(b.wordInfo.text));
    const top = priorityMatches.length * 0.2;
    return priorityMatches.slice(0, top).concat(prefixMatches, priorityMatches.slice(top), includesMatches).slice(0, _a.suggestionCount);
}, _TextAreaAutoComplete_update = function _TextAreaAutoComplete_update() {
    var _b, _c;
    let before = this.helper.getBeforeCursor();
    if (before === null || before === void 0 ? void 0 : before.length) {
        const m = before.match(/([^\s|,|;|"]+)$/);
        if (m) {
            before = m[0];
        }
        else {
            before = null;
        }
    }
    if (!before) {
        __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_hide).call(this);
        return;
    }
    this.currentWords = __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_getFilteredWords).call(this, before);
    if (!this.currentWords.length) {
        __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_hide).call(this);
        return;
    }
    this.dropdown.style.display = "";
    let hasSelected = false;
    const items = this.currentWords.map(({ wordInfo, pos }, i) => {
        const parts = [
            $el("span", {
                textContent: wordInfo.text.substr(0, pos),
            }),
            $el("span.jk-nodes-autocomplete-highlight", {
                textContent: wordInfo.text.substr(pos, before.length),
            }),
            $el("span", {
                textContent: wordInfo.text.substr(pos + before.length),
            }),
        ];
        if (wordInfo.hint) {
            parts.push($el("span.jk-nodes-autocomplete-pill", {
                textContent: wordInfo.hint,
            }));
        }
        if (wordInfo.priority) {
            parts.push($el("span.jk-nodes-autocomplete-pill", {
                textContent: wordInfo.priority,
            }));
        }
        if (wordInfo.value && wordInfo.text !== wordInfo.value && wordInfo.showValue !== false) {
            parts.push($el("span.jk-nodes-autocomplete-pill", {
                textContent: wordInfo.value,
            }));
        }
        if (wordInfo.info) {
            parts.push($el("a.jk-nodes-autocomplete-item-info", {
                textContent: "ℹ️",
                title: "View info...",
                onclick: (e) => {
                    e.stopPropagation();
                    wordInfo.info();
                    e.preventDefault();
                },
            }));
        }
        const item = $el("div.jk-nodes-autocomplete-item", {
            onclick: () => {
                var _b, _c, _d;
                this.el.focus();
                let value = (_b = wordInfo.value) !== null && _b !== void 0 ? _b : wordInfo.text;
                const use_replacer = (_c = wordInfo.use_replacer) !== null && _c !== void 0 ? _c : true;
                if (_a.replacer && use_replacer) {
                    value = _a.replacer(value);
                }
                value = __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_escapeParentheses).call(this, value);
                const afterCursor = this.helper.getAfterCursor();
                if ((_d = wordInfo.activation_text) === null || _d === void 0 ? void 0 : _d.trim()) {
                    value += wordInfo.activation_text;
                }
                const shouldAddSeparator = !afterCursor.trim().startsWith(this.separator.trim());
                this.helper.insertAtCursor(value + (shouldAddSeparator ? this.separator : ''), -before.length, wordInfo.caretOffset);
                setTimeout(() => {
                    __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_update).call(this);
                }, 150);
            },
        }, parts);
        if (wordInfo === this.selected) {
            hasSelected = true;
        }
        wordInfo.index = i;
        wordInfo.el = item;
        return item;
    });
    __classPrivateFieldGet(this, _TextAreaAutoComplete_instances, "m", _TextAreaAutoComplete_setSelected).call(this, hasSelected ? this.selected : this.currentWords[0].wordInfo);
    this.dropdown.replaceChildren(...items);
    if (!this.dropdown.parentElement) {
        document.body.append(this.dropdown);
    }
    const position = this.helper.getCursorOffset();
    this.dropdown.style.left = ((_b = position.left) !== null && _b !== void 0 ? _b : 0) + "px";
    this.dropdown.style.top = ((_c = position.top) !== null && _c !== void 0 ? _c : 0) + "px";
    this.dropdown.style.maxHeight = (window.innerHeight - position.top) + "px";
}, _TextAreaAutoComplete_escapeParentheses = function _TextAreaAutoComplete_escapeParentheses(text) {
    return text.replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}, _TextAreaAutoComplete_hide = function _TextAreaAutoComplete_hide() {
    this.selected = null;
    this.dropdown.remove();
};
TextAreaAutoComplete.globalSeparator = "";
TextAreaAutoComplete.enabled = true;
TextAreaAutoComplete.insertOnTab = true;
TextAreaAutoComplete.insertOnEnter = true;
TextAreaAutoComplete.replacer = undefined;
TextAreaAutoComplete.lorasEnabled = false;
TextAreaAutoComplete.suggestionCount = 20;
TextAreaAutoComplete.groups = {};
TextAreaAutoComplete.globalGroups = new Set();
TextAreaAutoComplete.globalWords = {};
TextAreaAutoComplete.globalWordsExclLoras = {};
