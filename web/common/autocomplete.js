"use strict";
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _TextAreaCaretHelper_instances, calculateElementOffset_fn, isDigit_fn, getLineHeightPx_fn, calculateLineHeightPx_fn, getElScroll_fn, getCursorPosition_fn, _TextAreaAutoComplete_instances, setup_fn, keyDown_fn, keyPress_fn, keyUp_fn, setSelected_fn, insertItem_fn, getFilteredWords_fn, update_fn, escapeParentheses_fn, hide_fn;
import { $el } from "../../../../scripts/ui.js";
import { addStylesheet } from "./utils.js";
addStylesheet(import.meta.url);
const getCaretCoordinates = function() {
  var properties = [
    "direction",
    // RTL support
    "boxSizing",
    "width",
    // on Chrome and IE, exclude the scrollbar, so the mirror div wraps exactly as the textarea does
    "height",
    "overflowX",
    "overflowY",
    // copy the scrollbar for IE
    "borderTopWidth",
    "borderRightWidth",
    "borderBottomWidth",
    "borderLeftWidth",
    "borderStyle",
    "paddingTop",
    "paddingRight",
    "paddingBottom",
    "paddingLeft",
    // https://developer.mozilla.org/en-US/docs/Web/CSS/font
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
    // might not make a difference, but better be safe
    "letterSpacing",
    "wordSpacing",
    "tabSize",
    "MozTabSize"
  ];
  var isBrowser = typeof window !== "undefined";
  var isFirefox = isBrowser && window.mozInnerScreenX != null;
  return function getCaretCoordinates2(element, position, options) {
    if (!isBrowser) {
      throw new Error("textarea-caret-position#getCaretCoordinates should only be called in a browser");
    }
    var debug = options && options.debug || false;
    if (debug) {
      var el = document.querySelector("#input-textarea-caret-position-mirror-div");
      if (el) el.parentNode.removeChild(el);
    }
    var div = document.createElement("div");
    div.id = "input-textarea-caret-position-mirror-div";
    document.body.appendChild(div);
    var style = div.style;
    var computed = window.getComputedStyle ? window.getComputedStyle(element) : element.currentStyle;
    var isInput = element.nodeName === "INPUT";
    style.whiteSpace = "pre-wrap";
    if (!isInput) style.wordWrap = "break-word";
    style.position = "absolute";
    if (!debug) style.visibility = "hidden";
    properties.forEach(function(prop) {
      if (isInput && prop === "lineHeight") {
        if (computed.boxSizing === "border-box") {
          var height = parseInt(computed.height);
          var outerHeight = parseInt(computed.paddingTop) + parseInt(computed.paddingBottom) + parseInt(computed.borderTopWidth) + parseInt(computed.borderBottomWidth);
          var targetHeight = outerHeight + parseInt(computed.lineHeight);
          if (height > targetHeight) {
            style.lineHeight = height - outerHeight + "px";
          } else if (height === targetHeight) {
            style.lineHeight = computed.lineHeight;
          } else {
            style.lineHeight = 0;
          }
        } else {
          style.lineHeight = computed.height;
        }
      } else {
        style[prop] = computed[prop];
      }
    });
    if (isFirefox) {
      if (element.scrollHeight > parseInt(computed.height)) style.overflowY = "scroll";
    } else {
      style.overflow = "hidden";
    }
    div.textContent = element.value.substring(0, position);
    if (isInput) div.textContent = div.textContent.replace(/\s/g, "\xA0");
    var span = document.createElement("span");
    span.textContent = element.value.substring(position) || ".";
    div.appendChild(span);
    var coordinates = {
      top: span.offsetTop + parseInt(computed["borderTopWidth"]),
      left: span.offsetLeft + parseInt(computed["borderLeftWidth"]),
      height: parseInt(computed["lineHeight"])
    };
    if (debug) {
      span.style.backgroundColor = "#aaa";
    } else {
      document.body.removeChild(div);
    }
    return coordinates;
  };
}();
const CHAR_CODE_ZERO = "0".charCodeAt(0);
const CHAR_CODE_NINE = "9".charCodeAt(0);
class TextAreaCaretHelper {
  constructor(el, getScale) {
    __privateAdd(this, _TextAreaCaretHelper_instances);
    this.el = el;
    this.getScale = getScale;
  }
  getCursorOffset() {
    const scale = this.getScale();
    const elOffset = __privateMethod(this, _TextAreaCaretHelper_instances, calculateElementOffset_fn).call(this);
    const elScroll = __privateMethod(this, _TextAreaCaretHelper_instances, getElScroll_fn).call(this);
    const cursorPosition = __privateMethod(this, _TextAreaCaretHelper_instances, getCursorPosition_fn).call(this);
    const lineHeight = __privateMethod(this, _TextAreaCaretHelper_instances, getLineHeightPx_fn).call(this);
    const top = elOffset.top - elScroll.top * scale + (cursorPosition.top + lineHeight) * scale;
    const left = elOffset.left - elScroll.left + cursorPosition.left;
    const clientTop = this.el.getBoundingClientRect().top;
    if (this.el.dir !== "rtl") {
      return { top, left, lineHeight, clientTop };
    } else {
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
      } catch (e) {
        console.error("Error caught during execCommand:", e);
        pasted = false;
      }
      if (!pasted) {
        console.error(
          "execCommand unsuccessful; not supported. Adding text manually, no undo support."
        );
        textarea.setRangeText(modifiedText, this.el.selectionStart, this.el.selectionEnd, "end");
      }
      this.el.selectionEnd = this.el.selectionStart = startPos + value.length + offset + (finalOffset ?? 0);
    } else {
      let pasted = true;
      try {
        if (!document.execCommand("insertText", false, value)) {
          pasted = false;
        }
      } catch (e) {
        console.error("Error caught during execCommand:", e);
        pasted = false;
      }
      if (!pasted) {
        console.error(
          "execCommand unsuccessful; not supported. Adding text manually, no undo support."
        );
        this.el.value += value;
      }
    }
  }
}
_TextAreaCaretHelper_instances = new WeakSet();
calculateElementOffset_fn = function() {
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
    left: rect.left + defaultView.pageXOffset
  };
  if (documentElement) {
    offset.top -= documentElement.clientTop;
    offset.left -= documentElement.clientLeft;
  }
  return offset;
};
isDigit_fn = function(charCode) {
  return CHAR_CODE_ZERO <= charCode && charCode <= CHAR_CODE_NINE;
};
getLineHeightPx_fn = function() {
  const computedStyle = getComputedStyle(this.el);
  const lineHeight = computedStyle.lineHeight;
  if (__privateMethod(this, _TextAreaCaretHelper_instances, isDigit_fn).call(this, lineHeight.charCodeAt(0))) {
    const floatLineHeight = parseFloat(lineHeight);
    return __privateMethod(this, _TextAreaCaretHelper_instances, isDigit_fn).call(this, lineHeight.charCodeAt(lineHeight.length - 1)) ? floatLineHeight * parseFloat(computedStyle.fontSize) : floatLineHeight;
  }
  return __privateMethod(this, _TextAreaCaretHelper_instances, calculateLineHeightPx_fn).call(this, this.el.nodeName, computedStyle);
};
/**
 * Returns calculated line-height of the given node in pixels.
 */
calculateLineHeightPx_fn = function(nodeName, computedStyle) {
  const body = document.body;
  if (!body) return 0;
  const tempNode = document.createElement(nodeName);
  tempNode.innerHTML = "&nbsp;";
  Object.assign(tempNode.style, {
    fontSize: computedStyle.fontSize,
    fontFamily: computedStyle.fontFamily,
    padding: "0",
    position: "absolute"
  });
  body.appendChild(tempNode);
  if (tempNode instanceof HTMLTextAreaElement) {
    tempNode.rows = 1;
  }
  const height = tempNode.offsetHeight;
  body.removeChild(tempNode);
  return height;
};
getElScroll_fn = function() {
  return { top: this.el.scrollTop, left: this.el.scrollLeft };
};
getCursorPosition_fn = function() {
  return getCaretCoordinates(this.el, this.el.selectionEnd);
};
const _TextAreaAutoComplete = class _TextAreaAutoComplete {
  /**
   * @param {HTMLTextAreaElement} el
   */
  constructor(el, words = null, separator = null) {
    __privateAdd(this, _TextAreaAutoComplete_instances);
    this.overrideSeparator = "";
    this.el = el;
    this.helper = new TextAreaCaretHelper(el, () => app.canvas.ds.scale);
    this.dropdown = $el("div.jk-nodes-autocomplete");
    this.overrideWords = words;
    this.overrideSeparator = separator;
    __privateMethod(this, _TextAreaAutoComplete_instances, setup_fn).call(this);
  }
  get words() {
    return this.overrideWords ?? _TextAreaAutoComplete.globalWords;
  }
  get separator() {
    return this.overrideSeparator ?? _TextAreaAutoComplete.globalSeparator;
  }
  static updateWords(id, words, addGlobal = true) {
    const isUpdate = id in _TextAreaAutoComplete.groups;
    _TextAreaAutoComplete.groups[id] = words;
    if (addGlobal) {
      _TextAreaAutoComplete.globalGroups.add(id);
    }
    if (isUpdate) {
      _TextAreaAutoComplete.globalWords = Object.assign(
        {},
        ...Object.keys(_TextAreaAutoComplete.groups).filter((k) => _TextAreaAutoComplete.globalGroups.has(k)).map((k) => _TextAreaAutoComplete.groups[k])
      );
    } else if (addGlobal) {
      Object.assign(_TextAreaAutoComplete.globalWords, words);
    }
  }
};
_TextAreaAutoComplete_instances = new WeakSet();
setup_fn = function() {
  this.el.addEventListener("keydown", __privateMethod(this, _TextAreaAutoComplete_instances, keyDown_fn).bind(this));
  this.el.addEventListener("keypress", __privateMethod(this, _TextAreaAutoComplete_instances, keyPress_fn).bind(this));
  this.el.addEventListener("keyup", __privateMethod(this, _TextAreaAutoComplete_instances, keyUp_fn).bind(this));
  this.el.addEventListener("click", __privateMethod(this, _TextAreaAutoComplete_instances, hide_fn).bind(this));
  this.el.addEventListener("blur", () => setTimeout(() => __privateMethod(this, _TextAreaAutoComplete_instances, hide_fn).call(this), 150));
};
/**
 * @param {KeyboardEvent} e
 */
keyDown_fn = function(e) {
  if (!_TextAreaAutoComplete.enabled) return;
  if (this.dropdown.parentElement) {
    switch (e.key) {
      case "ArrowUp":
        e.preventDefault();
        if (this.selected.index) {
          __privateMethod(this, _TextAreaAutoComplete_instances, setSelected_fn).call(this, this.currentWords[this.selected.index - 1].wordInfo);
        } else {
          __privateMethod(this, _TextAreaAutoComplete_instances, setSelected_fn).call(this, this.currentWords[this.currentWords.length - 1].wordInfo);
        }
        break;
      case "ArrowDown":
        e.preventDefault();
        if (this.selected.index === this.currentWords.length - 1) {
          __privateMethod(this, _TextAreaAutoComplete_instances, setSelected_fn).call(this, this.currentWords[0].wordInfo);
        } else {
          __privateMethod(this, _TextAreaAutoComplete_instances, setSelected_fn).call(this, this.currentWords[this.selected.index + 1].wordInfo);
        }
        break;
      case "Tab":
        if (_TextAreaAutoComplete.insertOnTab) {
          __privateMethod(this, _TextAreaAutoComplete_instances, insertItem_fn).call(this);
          e.preventDefault();
        }
        break;
    }
  }
};
/**
 * @param {KeyboardEvent} e
 */
keyPress_fn = function(e) {
  if (!_TextAreaAutoComplete.enabled) return;
  if (this.dropdown.parentElement) {
    switch (e.key) {
      case "Enter":
        if (!e.ctrlKey) {
          const isLora = this.selected?.text?.toLowerCase().startsWith("<lora:");
          if (_TextAreaAutoComplete.insertOnEnter && !isLora) {
            __privateMethod(this, _TextAreaAutoComplete_instances, insertItem_fn).call(this);
            e.preventDefault();
          } else if (isLora && typeof this.selected.info === "function") {
            this.selected.info();
          }
        }
        break;
    }
  }
  if (!e.defaultPrevented) {
    __privateMethod(this, _TextAreaAutoComplete_instances, update_fn).call(this);
  }
};
keyUp_fn = function(e) {
  if (!_TextAreaAutoComplete.enabled) return;
  if (this.dropdown.parentElement) {
    switch (e.key) {
      case "Escape":
        e.preventDefault();
        __privateMethod(this, _TextAreaAutoComplete_instances, hide_fn).call(this);
        break;
    }
  } else if (e.key.length > 1 && e.key != "Delete" && e.key != "Backspace") {
    return;
  }
  if (!e.defaultPrevented) {
    __privateMethod(this, _TextAreaAutoComplete_instances, update_fn).call(this);
  }
};
setSelected_fn = function(item) {
  if (this.selected) {
    this.selected.el.classList.remove("jk-nodes-autocomplete-item--selected");
  }
  this.selected = item;
  this.selected.el.classList.add("jk-nodes-autocomplete-item--selected");
};
insertItem_fn = function() {
  if (!this.selected) return;
  this.selected.el.click();
};
/** @param {string} term  */
getFilteredWords_fn = function(term) {
  term = term.toLocaleLowerCase();
  const priorityMatches = [];
  const prefixMatches = [];
  const includesMatches = [];
  const termIsLora = term?.startsWith("<lora:");
  const termAfterLora = termIsLora ? term.substring(6) : void 0;
  const termIsWildcard = term?.startsWith("__");
  const termAfterWildcard = termIsWildcard ? term.substring(2) : void 0;
  for (const word of Object.keys(this.words)) {
    const lowerWord = word.toLocaleLowerCase();
    if (lowerWord === term) {
      continue;
    }
    const wordIsWildcard = word.startsWith("__");
    if (wordIsWildcard && !termIsWildcard) {
      continue;
    }
    if (termIsWildcard && !wordIsWildcard) {
      continue;
    }
    const wordIsLora = word.startsWith("<lora:");
    const includeIt = wordIsLora && termIsLora || !wordIsLora && !termIsLora;
    if (!includeIt) {
      continue;
    }
    if (wordIsLora && termIsLora) {
      term = termAfterLora;
    } else if (termIsWildcard && wordIsWildcard) {
      term = termAfterWildcard;
    }
    const pos = lowerWord.indexOf(term);
    if (pos === -1) {
      continue;
    }
    const wordInfo = this.words[word];
    if (wordInfo.priority) {
      priorityMatches.push({ pos, wordInfo });
    } else if (pos) {
      includesMatches.push({ pos, wordInfo });
    } else {
      prefixMatches.push({ pos, wordInfo });
    }
  }
  priorityMatches.sort(
    (a, b) => b.wordInfo.priority - a.wordInfo.priority || a.wordInfo.text.length - b.wordInfo.text.length || a.wordInfo.text.localeCompare(b.wordInfo.text)
  );
  const top = priorityMatches.length * 0.2;
  return priorityMatches.slice(0, top).concat(prefixMatches, priorityMatches.slice(top), includesMatches).slice(0, _TextAreaAutoComplete.suggestionCount);
};
update_fn = function() {
  let before = this.helper.getBeforeCursor();
  if (before?.length) {
    const m = before.match(/([^\s|,|;|"]+)$/);
    if (m) {
      before = m[0];
    } else {
      before = null;
    }
  }
  if (!before) {
    __privateMethod(this, _TextAreaAutoComplete_instances, hide_fn).call(this);
    return;
  }
  this.currentWords = __privateMethod(this, _TextAreaAutoComplete_instances, getFilteredWords_fn).call(this, before);
  if (!this.currentWords.length) {
    __privateMethod(this, _TextAreaAutoComplete_instances, hide_fn).call(this);
    return;
  }
  this.dropdown.style.display = "";
  let hasSelected = false;
  const items = this.currentWords.map(({ wordInfo, pos }, i) => {
    const parts = [
      $el("span", {
        textContent: wordInfo.text.substr(0, pos)
      }),
      $el("span.jk-nodes-autocomplete-highlight", {
        textContent: wordInfo.text.substr(pos, before.length)
      }),
      $el("span", {
        textContent: wordInfo.text.substr(pos + before.length)
      })
    ];
    if (wordInfo.hint) {
      parts.push(
        $el("span.jk-nodes-autocomplete-pill", {
          textContent: wordInfo.hint
        })
      );
    }
    if (wordInfo.priority) {
      parts.push(
        $el("span.jk-nodes-autocomplete-pill", {
          textContent: wordInfo.priority
        })
      );
    }
    if (wordInfo.value && wordInfo.text !== wordInfo.value && wordInfo.showValue !== false) {
      parts.push(
        $el("span.jk-nodes-autocomplete-pill", {
          textContent: wordInfo.value
        })
      );
    }
    if (wordInfo.info) {
      parts.push(
        $el("a.jk-nodes-autocomplete-item-info", {
          textContent: "\u2139\uFE0F",
          title: "View info...",
          onclick: (e) => {
            e.stopPropagation();
            wordInfo.info();
            e.preventDefault();
          }
        })
      );
    }
    const item = $el(
      "div.jk-nodes-autocomplete-item",
      {
        onclick: () => {
          this.el.focus();
          let value = wordInfo.value ?? wordInfo.text;
          const use_replacer = wordInfo.use_replacer ?? true;
          if (_TextAreaAutoComplete.replacer && use_replacer) {
            value = _TextAreaAutoComplete.replacer(value);
          }
          value = __privateMethod(this, _TextAreaAutoComplete_instances, escapeParentheses_fn).call(this, value);
          const afterCursor = this.helper.getAfterCursor();
          if (wordInfo.activation_text?.trim()) {
            value += wordInfo.activation_text;
          }
          const shouldAddSeparator = !afterCursor.trim().startsWith(this.separator.trim());
          this.helper.insertAtCursor(
            value + (shouldAddSeparator ? this.separator : ""),
            -before.length,
            wordInfo.caretOffset
          );
          setTimeout(() => {
            __privateMethod(this, _TextAreaAutoComplete_instances, update_fn).call(this);
          }, 150);
        }
      },
      parts
    );
    if (wordInfo === this.selected) {
      hasSelected = true;
    }
    wordInfo.index = i;
    wordInfo.el = item;
    return item;
  });
  __privateMethod(this, _TextAreaAutoComplete_instances, setSelected_fn).call(this, hasSelected ? this.selected : this.currentWords[0].wordInfo);
  this.dropdown.replaceChildren(...items);
  if (!this.dropdown.parentElement) {
    document.body.append(this.dropdown);
  }
  const position = this.helper.getCursorOffset();
  this.dropdown.style.left = (position.left ?? 0) + "px";
  this.dropdown.style.top = (position.top ?? 0) + "px";
  this.dropdown.style.maxHeight = window.innerHeight - position.top + "px";
};
escapeParentheses_fn = function(text) {
  return text.replace(/\(/g, "\\(").replace(/\)/g, "\\)");
};
hide_fn = function() {
  this.selected = null;
  this.dropdown.remove();
};
_TextAreaAutoComplete.globalSeparator = "";
_TextAreaAutoComplete.enabled = true;
_TextAreaAutoComplete.insertOnTab = true;
_TextAreaAutoComplete.insertOnEnter = true;
_TextAreaAutoComplete.replacer = void 0;
_TextAreaAutoComplete.lorasEnabled = false;
_TextAreaAutoComplete.suggestionCount = 20;
/** @type {Record<string, Record<string, AutoCompleteEntry>>} */
_TextAreaAutoComplete.groups = {};
/** @type {Set<string>} */
_TextAreaAutoComplete.globalGroups = /* @__PURE__ */ new Set();
/** @type {Record<string, AutoCompleteEntry>} */
_TextAreaAutoComplete.globalWords = {};
/** @type {Record<string, AutoCompleteEntry>} */
_TextAreaAutoComplete.globalWordsExclLoras = {};
export let TextAreaAutoComplete = _TextAreaAutoComplete;
