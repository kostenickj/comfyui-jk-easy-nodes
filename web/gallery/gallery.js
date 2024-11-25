var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// node_modules/.pnpm/macy@2.5.1/node_modules/macy/dist/macy.js
var require_macy = __commonJS({
  "node_modules/.pnpm/macy@2.5.1/node_modules/macy/dist/macy.js"(exports, module) {
    !function(t4, n6) {
      "object" == typeof exports && "undefined" != typeof module ? module.exports = n6() : "function" == typeof define && define.amd ? define(n6) : t4.Macy = n6();
    }(exports, function() {
      "use strict";
      function t4(t5, n7) {
        var e9 = void 0;
        return function() {
          e9 && clearTimeout(e9), e9 = setTimeout(t5, n7);
        };
      }
      function n6(t5, n7) {
        for (var e9 = t5.length, r9 = e9, o7 = []; e9--; ) o7.push(n7(t5[r9 - e9 - 1]));
        return o7;
      }
      function e8(t5, n7) {
        var e9 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (window.Promise) return A2(t5, n7, e9);
        t5.recalculate(true, true);
      }
      function r8(t5) {
        for (var n7 = t5.options, e9 = t5.responsiveOptions, r9 = t5.keys, o7 = t5.docWidth, i7 = void 0, s4 = 0; s4 < r9.length; s4++) {
          var a4 = parseInt(r9[s4], 10);
          o7 >= a4 && (i7 = n7.breakAt[a4], O(i7, e9));
        }
        return e9;
      }
      function o6(t5) {
        for (var n7 = t5.options, e9 = t5.responsiveOptions, r9 = t5.keys, o7 = t5.docWidth, i7 = void 0, s4 = r9.length - 1; s4 >= 0; s4--) {
          var a4 = parseInt(r9[s4], 10);
          o7 <= a4 && (i7 = n7.breakAt[a4], O(i7, e9));
        }
        return e9;
      }
      function i6(t5) {
        var n7 = t5.useContainerForBreakpoints ? t5.container.clientWidth : window.innerWidth, e9 = { columns: t5.columns };
        b3(t5.margin) ? e9.margin = { x: t5.margin.x, y: t5.margin.y } : e9.margin = { x: t5.margin, y: t5.margin };
        var i7 = Object.keys(t5.breakAt);
        return t5.mobileFirst ? r8({ options: t5, responsiveOptions: e9, keys: i7, docWidth: n7 }) : o6({ options: t5, responsiveOptions: e9, keys: i7, docWidth: n7 });
      }
      function s3(t5) {
        return i6(t5).columns;
      }
      function a3(t5) {
        return i6(t5).margin;
      }
      function c4(t5) {
        var n7 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], e9 = s3(t5), r9 = a3(t5).x, o7 = 100 / e9;
        if (!n7) return o7;
        if (1 === e9) return "100%";
        var i7 = "px";
        if ("string" == typeof r9) {
          var c5 = parseFloat(r9);
          i7 = r9.replace(c5, ""), r9 = c5;
        }
        return r9 = (e9 - 1) * r9 / e9, "%" === i7 ? o7 - r9 + "%" : "calc(" + o7 + "% - " + r9 + i7 + ")";
      }
      function u3(t5, n7) {
        var e9 = s3(t5.options), r9 = 0, o7 = void 0, i7 = void 0;
        if (1 === ++n7) return 0;
        i7 = a3(t5.options).x;
        var u4 = "px";
        if ("string" == typeof i7) {
          var l4 = parseFloat(i7, 10);
          u4 = i7.replace(l4, ""), i7 = l4;
        }
        return o7 = (i7 - (e9 - 1) * i7 / e9) * (n7 - 1), r9 += c4(t5.options, false) * (n7 - 1), "%" === u4 ? r9 + o7 + "%" : "calc(" + r9 + "% + " + o7 + u4 + ")";
      }
      function l3(t5) {
        var n7 = 0, e9 = t5.container, r9 = t5.rows;
        v2(r9, function(t6) {
          n7 = t6 > n7 ? t6 : n7;
        }), e9.style.height = n7 + "px";
      }
      function p3(t5, n7) {
        var e9 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], r9 = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], o7 = s3(t5.options), i7 = a3(t5.options).y;
        M2(t5, o7, e9), v2(n7, function(n8) {
          var e10 = 0, o8 = parseInt(n8.offsetHeight, 10);
          isNaN(o8) || (t5.rows.forEach(function(n9, r10) {
            n9 < t5.rows[e10] && (e10 = r10);
          }), n8.style.position = "absolute", n8.style.top = t5.rows[e10] + "px", n8.style.left = "" + t5.cols[e10], t5.rows[e10] += isNaN(o8) ? 0 : o8 + i7, r9 && (n8.dataset.macyComplete = 1));
        }), r9 && (t5.tmpRows = null), l3(t5);
      }
      function f3(t5, n7) {
        var e9 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2], r9 = !(arguments.length > 3 && void 0 !== arguments[3]) || arguments[3], o7 = s3(t5.options), i7 = a3(t5.options).y;
        M2(t5, o7, e9), v2(n7, function(n8) {
          t5.lastcol === o7 && (t5.lastcol = 0);
          var e10 = C2(n8, "height");
          e10 = parseInt(n8.offsetHeight, 10), isNaN(e10) || (n8.style.position = "absolute", n8.style.top = t5.rows[t5.lastcol] + "px", n8.style.left = "" + t5.cols[t5.lastcol], t5.rows[t5.lastcol] += isNaN(e10) ? 0 : e10 + i7, t5.lastcol += 1, r9 && (n8.dataset.macyComplete = 1));
        }), r9 && (t5.tmpRows = null), l3(t5);
      }
      var h3 = function t5(n7, e9) {
        if (!(this instanceof t5)) return new t5(n7, e9);
        if (n7 && n7.nodeName) return n7;
        if (n7 = n7.replace(/^\s*/, "").replace(/\s*$/, ""), e9) return this.byCss(n7, e9);
        for (var r9 in this.selectors) if (e9 = r9.split("/"), new RegExp(e9[1], e9[2]).test(n7)) return this.selectors[r9](n7);
        return this.byCss(n7);
      };
      h3.prototype.byCss = function(t5, n7) {
        return (n7 || document).querySelectorAll(t5);
      }, h3.prototype.selectors = {}, h3.prototype.selectors[/^\.[\w\-]+$/] = function(t5) {
        return document.getElementsByClassName(t5.substring(1));
      }, h3.prototype.selectors[/^\w+$/] = function(t5) {
        return document.getElementsByTagName(t5);
      }, h3.prototype.selectors[/^\#[\w\-]+$/] = function(t5) {
        return document.getElementById(t5.substring(1));
      };
      var v2 = function(t5, n7) {
        for (var e9 = t5.length, r9 = e9; e9--; ) n7(t5[r9 - e9 - 1]);
      }, m2 = function() {
        var t5 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        this.running = false, this.events = [], this.add(t5);
      };
      m2.prototype.run = function() {
        if (!this.running && this.events.length > 0) {
          var t5 = this.events.shift();
          this.running = true, t5(), this.running = false, this.run();
        }
      }, m2.prototype.add = function() {
        var t5 = this, n7 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        return !!n7 && (Array.isArray(n7) ? v2(n7, function(n8) {
          return t5.add(n8);
        }) : (this.events.push(n7), void this.run()));
      }, m2.prototype.clear = function() {
        this.events = [];
      };
      var d3 = function(t5) {
        var n7 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        return this.instance = t5, this.data = n7, this;
      }, y3 = function() {
        var t5 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        this.events = {}, this.instance = t5;
      };
      y3.prototype.on = function() {
        var t5 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], n7 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
        return !(!t5 || !n7) && (Array.isArray(this.events[t5]) || (this.events[t5] = []), this.events[t5].push(n7));
      }, y3.prototype.emit = function() {
        var t5 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], n7 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
        if (!t5 || !Array.isArray(this.events[t5])) return false;
        var e9 = new d3(this.instance, n7);
        v2(this.events[t5], function(t6) {
          return t6(e9);
        });
      };
      var g2 = function(t5) {
        return !("naturalHeight" in t5 && t5.naturalHeight + t5.naturalWidth === 0) || t5.width + t5.height !== 0;
      }, E2 = function(t5, n7) {
        var e9 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        return new Promise(function(t6, e10) {
          if (n7.complete) return g2(n7) ? t6(n7) : e10(n7);
          n7.addEventListener("load", function() {
            return g2(n7) ? t6(n7) : e10(n7);
          }), n7.addEventListener("error", function() {
            return e10(n7);
          });
        }).then(function(n8) {
          e9 && t5.emit(t5.constants.EVENT_IMAGE_LOAD, { img: n8 });
        }).catch(function(n8) {
          return t5.emit(t5.constants.EVENT_IMAGE_ERROR, { img: n8 });
        });
      }, w2 = function(t5, e9) {
        var r9 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        return n6(e9, function(n7) {
          return E2(t5, n7, r9);
        });
      }, A2 = function(t5, n7) {
        var e9 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        return Promise.all(w2(t5, n7, e9)).then(function() {
          t5.emit(t5.constants.EVENT_IMAGE_COMPLETE);
        });
      }, I2 = function(n7) {
        return t4(function() {
          n7.emit(n7.constants.EVENT_RESIZE), n7.queue.add(function() {
            return n7.recalculate(true, true);
          });
        }, 100);
      }, N2 = function(t5) {
        if (t5.container = h3(t5.options.container), t5.container instanceof h3 || !t5.container) return !!t5.options.debug && console.error("Error: Container not found");
        t5.container.length && (t5.container = t5.container[0]), t5.options.container = t5.container, t5.container.style.position = "relative";
      }, T2 = function(t5) {
        t5.queue = new m2(), t5.events = new y3(t5), t5.rows = [], t5.resizer = I2(t5);
      }, L2 = function(t5) {
        var n7 = h3("img", t5.container);
        window.addEventListener("resize", t5.resizer), t5.on(t5.constants.EVENT_IMAGE_LOAD, function() {
          return t5.recalculate(false, false);
        }), t5.on(t5.constants.EVENT_IMAGE_COMPLETE, function() {
          return t5.recalculate(true, true);
        }), t5.options.useOwnImageLoader || e8(t5, n7, !t5.options.waitForImages), t5.emit(t5.constants.EVENT_INITIALIZED);
      }, _2 = function(t5) {
        N2(t5), T2(t5), L2(t5);
      }, b3 = function(t5) {
        return t5 === Object(t5) && "[object Array]" !== Object.prototype.toString.call(t5);
      }, O = function(t5, n7) {
        b3(t5) || (n7.columns = t5), b3(t5) && t5.columns && (n7.columns = t5.columns), b3(t5) && t5.margin && !b3(t5.margin) && (n7.margin = { x: t5.margin, y: t5.margin }), b3(t5) && t5.margin && b3(t5.margin) && t5.margin.x && (n7.margin.x = t5.margin.x), b3(t5) && t5.margin && b3(t5.margin) && t5.margin.y && (n7.margin.y = t5.margin.y);
      }, C2 = function(t5, n7) {
        return window.getComputedStyle(t5, null).getPropertyValue(n7);
      }, M2 = function(t5, n7) {
        var e9 = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
        if (t5.lastcol || (t5.lastcol = 0), t5.rows.length < 1 && (e9 = true), e9) {
          t5.rows = [], t5.cols = [], t5.lastcol = 0;
          for (var r9 = n7 - 1; r9 >= 0; r9--) t5.rows[r9] = 0, t5.cols[r9] = u3(t5, r9);
        } else if (t5.tmpRows) {
          t5.rows = [];
          for (var r9 = n7 - 1; r9 >= 0; r9--) t5.rows[r9] = t5.tmpRows[r9];
        } else {
          t5.tmpRows = [];
          for (var r9 = n7 - 1; r9 >= 0; r9--) t5.tmpRows[r9] = t5.rows[r9];
        }
      }, V2 = function(t5) {
        var n7 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], e9 = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2], r9 = n7 ? t5.container.children : h3(':scope > *:not([data-macy-complete="1"])', t5.container);
        r9 = Array.from(r9).filter(function(t6) {
          return null !== t6.offsetParent;
        });
        var o7 = c4(t5.options);
        return v2(r9, function(t6) {
          n7 && (t6.dataset.macyComplete = 0), t6.style.width = o7;
        }), t5.options.trueOrder ? (f3(t5, r9, n7, e9), t5.emit(t5.constants.EVENT_RECALCULATED)) : (p3(t5, r9, n7, e9), t5.emit(t5.constants.EVENT_RECALCULATED));
      }, R2 = function() {
        return !!window.Promise;
      }, x2 = Object.assign || function(t5) {
        for (var n7 = 1; n7 < arguments.length; n7++) {
          var e9 = arguments[n7];
          for (var r9 in e9) Object.prototype.hasOwnProperty.call(e9, r9) && (t5[r9] = e9[r9]);
        }
        return t5;
      };
      Array.from || (Array.from = function(t5) {
        for (var n7 = 0, e9 = []; n7 < t5.length; ) e9.push(t5[n7++]);
        return e9;
      });
      var k2 = { columns: 4, margin: 2, trueOrder: false, waitForImages: false, useImageLoader: true, breakAt: {}, useOwnImageLoader: false, onInit: false, cancelLegacy: false, useContainerForBreakpoints: false };
      !function() {
        try {
          document.createElement("a").querySelector(":scope *");
        } catch (t5) {
          !function() {
            function t6(t7) {
              return function(e10) {
                if (e10 && n7.test(e10)) {
                  var r10 = this.getAttribute("id");
                  r10 || (this.id = "q" + Math.floor(9e6 * Math.random()) + 1e6), arguments[0] = e10.replace(n7, "#" + this.id);
                  var o7 = t7.apply(this, arguments);
                  return null === r10 ? this.removeAttribute("id") : r10 || (this.id = r10), o7;
                }
                return t7.apply(this, arguments);
              };
            }
            var n7 = /:scope\b/gi, e9 = t6(Element.prototype.querySelector);
            Element.prototype.querySelector = function(t7) {
              return e9.apply(this, arguments);
            };
            var r9 = t6(Element.prototype.querySelectorAll);
            Element.prototype.querySelectorAll = function(t7) {
              return r9.apply(this, arguments);
            };
          }();
        }
      }();
      var q = function t5() {
        var n7 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : k2;
        if (!(this instanceof t5)) return new t5(n7);
        this.options = {}, x2(this.options, k2, n7), this.options.cancelLegacy && !R2() || _2(this);
      };
      return q.init = function(t5) {
        return console.warn("Depreciated: Macy.init will be removed in v3.0.0 opt to use Macy directly like so Macy({ /*options here*/ }) "), new q(t5);
      }, q.prototype.recalculateOnImageLoad = function() {
        var t5 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0];
        return e8(this, h3("img", this.container), !t5);
      }, q.prototype.runOnImageLoad = function(t5) {
        var n7 = arguments.length > 1 && void 0 !== arguments[1] && arguments[1], r9 = h3("img", this.container);
        return this.on(this.constants.EVENT_IMAGE_COMPLETE, t5), n7 && this.on(this.constants.EVENT_IMAGE_LOAD, t5), e8(this, r9, n7);
      }, q.prototype.recalculate = function() {
        var t5 = this, n7 = arguments.length > 0 && void 0 !== arguments[0] && arguments[0], e9 = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1];
        return e9 && this.queue.clear(), this.queue.add(function() {
          return V2(t5, n7, e9);
        });
      }, q.prototype.remove = function() {
        window.removeEventListener("resize", this.resizer), v2(this.container.children, function(t5) {
          t5.removeAttribute("data-macy-complete"), t5.removeAttribute("style");
        }), this.container.removeAttribute("style");
      }, q.prototype.reInit = function() {
        this.recalculate(true, true), this.emit(this.constants.EVENT_INITIALIZED), window.addEventListener("resize", this.resizer), this.container.style.position = "relative";
      }, q.prototype.on = function(t5, n7) {
        this.events.on(t5, n7);
      }, q.prototype.emit = function(t5, n7) {
        this.events.emit(t5, n7);
      }, q.constants = { EVENT_INITIALIZED: "macy.initialized", EVENT_RECALCULATED: "macy.recalculated", EVENT_IMAGE_LOAD: "macy.image.load", EVENT_IMAGE_ERROR: "macy.image.error", EVENT_IMAGE_COMPLETE: "macy.images.complete", EVENT_RESIZE: "macy.resize" }, q.prototype.constants = q.constants, q;
    });
  }
});

// src_web/gallery/feedBar.ts
var FeedBarEvent = class extends CustomEvent {
  constructor(eventType, payload) {
    super(eventType, { detail: payload });
  }
};
var JKFeedBar = class extends EventTarget {
  constructor(el) {
    super();
    this.el = el;
    this.currentMode = "feed" /* feed */;
    this._checkedItems = /* @__PURE__ */ new Map();
    this.el.classList.add("comfyui-menu", "flex", "items-center", "justify-start");
    this.rightButtonGroup = document.createElement("div");
    this.el.append(this.rightButtonGroup);
    this.rightButtonGroup.classList.add("comfyui-button-group", "right");
    this.leftButtonGroup = document.createElement("div");
    this.el.append(this.leftButtonGroup);
    this.leftButtonGroup.classList.add("comfyui-button-group", "center");
    this.checkboxMenuWrapper = document.createElement("div");
    this.checkboxMenuWrapper.classList.add("jk-checkbox-wrapper");
    this.checkboxMenuWrapper.innerHTML = `
            <sl-dropdown id="jk-checkbox-menu-dropdown" stay-open-on-select="true">
            <sl-button title="Toggle which images node to show" class="checkbox-menu-trigger" size="small" variant="neutral" slot="trigger" caret>Toggle Node Visibility</sl-button>
            <sl-menu id="jk-checkbox-menu-menu">           
            </sl-menu>
            </sl-dropdown>
            <style>
                sl-button.checkbox-menu-trigger::part(base) { 
                    font-size:16px;
                    background-color: var(--comfy-menu-bg);
                    min-width: 250px;
                    text-align:left;
                    display: flex;
                    align-items: center;
                    justify-content: flex-start;
                }
                    sl-button.checkbox-menu-trigger::part(caret) { 
                        margin-left: auto;
                    }
                    sl-menu{
                        background-color: var(--comfy-menu-bg);
                        min-width: 250px;
                        color:  var(--fg-color);
                        sl-menu-item::part(base){
                            color:  var(--fg-color);
                            background-color: var(--comfy-menu-bg);
                        }
                        sl-menu-item::part(base):hover{
                            background-color: var(--primary-hover-bg);
                        }
                    }
            </style>
        `;
    this.el.prepend(this.checkboxMenuWrapper);
    this.checkboxMenuDropdown = document.getElementById("jk-checkbox-menu-dropdown");
    this.checkBoxMenuMenu = document.getElementById("jk-checkbox-menu-menu");
    this.checkBoxMenuMenu.addEventListener("sl-select", (ev) => {
      const item = ev?.detail?.item;
      this._checkedItems.set(item.value, item.checked);
      this.dispatchEvent(new FeedBarEvent("check-change" /* check-change */, {}));
    });
  }
  get checkedItems() {
    return this._checkedItems;
  }
  createMenuItem(item, isChecked) {
    const menuItem = document.createElement("sl-menu-item");
    menuItem.type = "checkbox";
    menuItem.value = item;
    menuItem.innerText = item;
    menuItem.checked = isChecked;
    return menuItem;
  }
  addCheckboxOptionIfNeeded(item, isChecked) {
    let needsInsert = false;
    if (!this.checkedItems.has(item)) {
      needsInsert = true;
    }
    this.checkedItems.set(item, isChecked);
    if (needsInsert) {
      const menuItem = this.createMenuItem(item, isChecked);
      this.checkBoxMenuMenu.appendChild(menuItem);
    }
  }
  updateCheckboxOptions(items, checkAll) {
    this.checkBoxMenuMenu.innerHTML = "";
    items.forEach((x2) => {
      const menuItem = this.createMenuItem(x2, checkAll || this.checkedItems.get(x2) ? true : false);
      this.checkBoxMenuMenu.appendChild(menuItem);
    });
    if (checkAll) {
      this._checkedItems.clear();
      items.forEach((x2) => {
        this._checkedItems.set(x2, true);
      });
    }
  }
  async init() {
    const ComfyButton = (await import("../../../scripts/ui/components/button.js")).ComfyButton;
    const clearFeedButton = new ComfyButton({
      icon: "nuke",
      action: () => {
        this.dispatchEvent(new FeedBarEvent("feed-clear" /* feed-clear */, {}));
      },
      tooltip: "Clear the feed",
      content: "Clear Feed"
    });
    const feedModeButton = new ComfyButton({
      icon: "image-frame",
      action: () => {
        if (this.currentMode !== "feed" /* feed */) {
          this.currentMode = "feed" /* feed */;
          feedModeButton.element.classList.add("primary");
          gridModeButton.element.classList.remove("primary");
          this.dispatchEvent(new FeedBarEvent("feed-mode" /* feed-mode */, "feed" /* feed */));
        }
      },
      tooltip: "Feed Display Node",
      content: "Feed"
    });
    feedModeButton.element.classList.add("primary");
    const gridModeButton = new ComfyButton({
      icon: "view-grid",
      action: () => {
        if (this.currentMode !== "grid" /* grid */) {
          this.currentMode = "grid" /* grid */;
          gridModeButton.element.classList.add("primary");
          feedModeButton.element.classList.remove("primary");
          this.dispatchEvent(new FeedBarEvent("feed-mode" /* feed-mode */, "grid" /* grid */));
        }
      },
      tooltip: "Grid Display Mode",
      content: "Grid"
    });
    this.rightButtonGroup.append(clearFeedButton.element);
    this.leftButtonGroup.append(feedModeButton.element, gridModeButton.element);
  }
};

// src_web/common/utils.ts
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

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/css-tag.js
var t = globalThis;
var e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
var s = Symbol();
var o = /* @__PURE__ */ new WeakMap();
var n = class {
  constructor(t4, e8, o6) {
    if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t4, this.t = e8;
  }
  get styleSheet() {
    let t4 = this.o;
    const s3 = this.t;
    if (e && void 0 === t4) {
      const e8 = void 0 !== s3 && 1 === s3.length;
      e8 && (t4 = o.get(s3)), void 0 === t4 && ((this.o = t4 = new CSSStyleSheet()).replaceSync(this.cssText), e8 && o.set(s3, t4));
    }
    return t4;
  }
  toString() {
    return this.cssText;
  }
};
var r = (t4) => new n("string" == typeof t4 ? t4 : t4 + "", void 0, s);
var i = (t4, ...e8) => {
  const o6 = 1 === t4.length ? t4[0] : e8.reduce((e9, s3, o7) => e9 + ((t5) => {
    if (true === t5._$cssResult$) return t5.cssText;
    if ("number" == typeof t5) return t5;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t5 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s3) + t4[o7 + 1], t4[0]);
  return new n(o6, t4, s);
};
var S = (s3, o6) => {
  if (e) s3.adoptedStyleSheets = o6.map((t4) => t4 instanceof CSSStyleSheet ? t4 : t4.styleSheet);
  else for (const e8 of o6) {
    const o7 = document.createElement("style"), n6 = t.litNonce;
    void 0 !== n6 && o7.setAttribute("nonce", n6), o7.textContent = e8.cssText, s3.appendChild(o7);
  }
};
var c = e ? (t4) => t4 : (t4) => t4 instanceof CSSStyleSheet ? ((t5) => {
  let e8 = "";
  for (const s3 of t5.cssRules) e8 += s3.cssText;
  return r(e8);
})(t4) : t4;

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/reactive-element.js
var { is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object;
var a = globalThis;
var c2 = a.trustedTypes;
var l = c2 ? c2.emptyScript : "";
var p = a.reactiveElementPolyfillSupport;
var d = (t4, s3) => t4;
var u = { toAttribute(t4, s3) {
  switch (s3) {
    case Boolean:
      t4 = t4 ? l : null;
      break;
    case Object:
    case Array:
      t4 = null == t4 ? t4 : JSON.stringify(t4);
  }
  return t4;
}, fromAttribute(t4, s3) {
  let i6 = t4;
  switch (s3) {
    case Boolean:
      i6 = null !== t4;
      break;
    case Number:
      i6 = null === t4 ? null : Number(t4);
      break;
    case Object:
    case Array:
      try {
        i6 = JSON.parse(t4);
      } catch (t5) {
        i6 = null;
      }
  }
  return i6;
} };
var f = (t4, s3) => !i2(t4, s3);
var y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
var b = class extends HTMLElement {
  static addInitializer(t4) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t4);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t4, s3 = y) {
    if (s3.state && (s3.attribute = false), this._$Ei(), this.elementProperties.set(t4, s3), !s3.noAccessor) {
      const i6 = Symbol(), r8 = this.getPropertyDescriptor(t4, i6, s3);
      void 0 !== r8 && e2(this.prototype, t4, r8);
    }
  }
  static getPropertyDescriptor(t4, s3, i6) {
    const { get: e8, set: h3 } = r2(this.prototype, t4) ?? { get() {
      return this[s3];
    }, set(t5) {
      this[s3] = t5;
    } };
    return { get() {
      return e8?.call(this);
    }, set(s4) {
      const r8 = e8?.call(this);
      h3.call(this, s4), this.requestUpdate(t4, r8, i6);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t4) {
    return this.elementProperties.get(t4) ?? y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d("elementProperties"))) return;
    const t4 = n2(this);
    t4.finalize(), void 0 !== t4.l && (this.l = [...t4.l]), this.elementProperties = new Map(t4.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
      const t5 = this.properties, s3 = [...h(t5), ...o2(t5)];
      for (const i6 of s3) this.createProperty(i6, t5[i6]);
    }
    const t4 = this[Symbol.metadata];
    if (null !== t4) {
      const s3 = litPropertyMetadata.get(t4);
      if (void 0 !== s3) for (const [t5, i6] of s3) this.elementProperties.set(t5, i6);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t5, s3] of this.elementProperties) {
      const i6 = this._$Eu(t5, s3);
      void 0 !== i6 && this._$Eh.set(i6, t5);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s3) {
    const i6 = [];
    if (Array.isArray(s3)) {
      const e8 = new Set(s3.flat(1 / 0).reverse());
      for (const s4 of e8) i6.unshift(c(s4));
    } else void 0 !== s3 && i6.push(c(s3));
    return i6;
  }
  static _$Eu(t4, s3) {
    const i6 = s3.attribute;
    return false === i6 ? void 0 : "string" == typeof i6 ? i6 : "string" == typeof t4 ? t4.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t4) => this.enableUpdating = t4), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t4) => t4(this));
  }
  addController(t4) {
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t4), void 0 !== this.renderRoot && this.isConnected && t4.hostConnected?.();
  }
  removeController(t4) {
    this._$EO?.delete(t4);
  }
  _$E_() {
    const t4 = /* @__PURE__ */ new Map(), s3 = this.constructor.elementProperties;
    for (const i6 of s3.keys()) this.hasOwnProperty(i6) && (t4.set(i6, this[i6]), delete this[i6]);
    t4.size > 0 && (this._$Ep = t4);
  }
  createRenderRoot() {
    const t4 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S(t4, this.constructor.elementStyles), t4;
  }
  connectedCallback() {
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t4) => t4.hostConnected?.());
  }
  enableUpdating(t4) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t4) => t4.hostDisconnected?.());
  }
  attributeChangedCallback(t4, s3, i6) {
    this._$AK(t4, i6);
  }
  _$EC(t4, s3) {
    const i6 = this.constructor.elementProperties.get(t4), e8 = this.constructor._$Eu(t4, i6);
    if (void 0 !== e8 && true === i6.reflect) {
      const r8 = (void 0 !== i6.converter?.toAttribute ? i6.converter : u).toAttribute(s3, i6.type);
      this._$Em = t4, null == r8 ? this.removeAttribute(e8) : this.setAttribute(e8, r8), this._$Em = null;
    }
  }
  _$AK(t4, s3) {
    const i6 = this.constructor, e8 = i6._$Eh.get(t4);
    if (void 0 !== e8 && this._$Em !== e8) {
      const t5 = i6.getPropertyOptions(e8), r8 = "function" == typeof t5.converter ? { fromAttribute: t5.converter } : void 0 !== t5.converter?.fromAttribute ? t5.converter : u;
      this._$Em = e8, this[e8] = r8.fromAttribute(s3, t5.type), this._$Em = null;
    }
  }
  requestUpdate(t4, s3, i6) {
    if (void 0 !== t4) {
      if (i6 ?? (i6 = this.constructor.getPropertyOptions(t4)), !(i6.hasChanged ?? f)(this[t4], s3)) return;
      this.P(t4, s3, i6);
    }
    false === this.isUpdatePending && (this._$ES = this._$ET());
  }
  P(t4, s3, i6) {
    this._$AL.has(t4) || this._$AL.set(t4, s3), true === i6.reflect && this._$Em !== t4 && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t4);
  }
  async _$ET() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t5) {
      Promise.reject(t5);
    }
    const t4 = this.scheduleUpdate();
    return null != t4 && await t4, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t6, s4] of this._$Ep) this[t6] = s4;
        this._$Ep = void 0;
      }
      const t5 = this.constructor.elementProperties;
      if (t5.size > 0) for (const [s4, i6] of t5) true !== i6.wrapped || this._$AL.has(s4) || void 0 === this[s4] || this.P(s4, this[s4], i6);
    }
    let t4 = false;
    const s3 = this._$AL;
    try {
      t4 = this.shouldUpdate(s3), t4 ? (this.willUpdate(s3), this._$EO?.forEach((t5) => t5.hostUpdate?.()), this.update(s3)) : this._$EU();
    } catch (s4) {
      throw t4 = false, this._$EU(), s4;
    }
    t4 && this._$AE(s3);
  }
  willUpdate(t4) {
  }
  _$AE(t4) {
    this._$EO?.forEach((t5) => t5.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t4)), this.updated(t4);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t4) {
    return true;
  }
  update(t4) {
    this._$Ej && (this._$Ej = this._$Ej.forEach((t5) => this._$EC(t5, this[t5]))), this._$EU();
  }
  updated(t4) {
  }
  firstUpdated(t4) {
  }
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.0.4");

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/lit-html.js
var t2 = globalThis;
var i3 = t2.trustedTypes;
var s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t4) => t4 }) : void 0;
var e3 = "$lit$";
var h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
var o3 = "?" + h2;
var n3 = `<${o3}>`;
var r3 = document;
var l2 = () => r3.createComment("");
var c3 = (t4) => null === t4 || "object" != typeof t4 && "function" != typeof t4;
var a2 = Array.isArray;
var u2 = (t4) => a2(t4) || "function" == typeof t4?.[Symbol.iterator];
var d2 = "[ 	\n\f\r]";
var f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
var v = /-->/g;
var _ = />/g;
var m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
var p2 = /'/g;
var g = /"/g;
var $ = /^(?:script|style|textarea|title)$/i;
var y2 = (t4) => (i6, ...s3) => ({ _$litType$: t4, strings: i6, values: s3 });
var x = y2(1);
var b2 = y2(2);
var w = y2(3);
var T = Symbol.for("lit-noChange");
var E = Symbol.for("lit-nothing");
var A = /* @__PURE__ */ new WeakMap();
var C = r3.createTreeWalker(r3, 129);
function P(t4, i6) {
  if (!a2(t4) || !t4.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s2 ? s2.createHTML(i6) : i6;
}
var V = (t4, i6) => {
  const s3 = t4.length - 1, o6 = [];
  let r8, l3 = 2 === i6 ? "<svg>" : 3 === i6 ? "<math>" : "", c4 = f2;
  for (let i7 = 0; i7 < s3; i7++) {
    const s4 = t4[i7];
    let a3, u3, d3 = -1, y3 = 0;
    for (; y3 < s4.length && (c4.lastIndex = y3, u3 = c4.exec(s4), null !== u3); ) y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($.test(u3[2]) && (r8 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r8 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r8 = void 0);
    const x2 = c4 === m && t4[i7 + 1].startsWith("/>") ? " " : "";
    l3 += c4 === f2 ? s4 + n3 : d3 >= 0 ? (o6.push(a3), s4.slice(0, d3) + e3 + s4.slice(d3) + h2 + x2) : s4 + h2 + (-2 === d3 ? i7 : x2);
  }
  return [P(t4, l3 + (t4[s3] || "<?>") + (2 === i6 ? "</svg>" : 3 === i6 ? "</math>" : "")), o6];
};
var N = class _N {
  constructor({ strings: t4, _$litType$: s3 }, n6) {
    let r8;
    this.parts = [];
    let c4 = 0, a3 = 0;
    const u3 = t4.length - 1, d3 = this.parts, [f3, v2] = V(t4, s3);
    if (this.el = _N.createElement(f3, n6), C.currentNode = this.el.content, 2 === s3 || 3 === s3) {
      const t5 = this.el.content.firstChild;
      t5.replaceWith(...t5.childNodes);
    }
    for (; null !== (r8 = C.nextNode()) && d3.length < u3; ) {
      if (1 === r8.nodeType) {
        if (r8.hasAttributes()) for (const t5 of r8.getAttributeNames()) if (t5.endsWith(e3)) {
          const i6 = v2[a3++], s4 = r8.getAttribute(t5).split(h2), e8 = /([.?@])?(.*)/.exec(i6);
          d3.push({ type: 1, index: c4, name: e8[2], strings: s4, ctor: "." === e8[1] ? H : "?" === e8[1] ? I : "@" === e8[1] ? L : k }), r8.removeAttribute(t5);
        } else t5.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r8.removeAttribute(t5));
        if ($.test(r8.tagName)) {
          const t5 = r8.textContent.split(h2), s4 = t5.length - 1;
          if (s4 > 0) {
            r8.textContent = i3 ? i3.emptyScript : "";
            for (let i6 = 0; i6 < s4; i6++) r8.append(t5[i6], l2()), C.nextNode(), d3.push({ type: 2, index: ++c4 });
            r8.append(t5[s4], l2());
          }
        }
      } else if (8 === r8.nodeType) if (r8.data === o3) d3.push({ type: 2, index: c4 });
      else {
        let t5 = -1;
        for (; -1 !== (t5 = r8.data.indexOf(h2, t5 + 1)); ) d3.push({ type: 7, index: c4 }), t5 += h2.length - 1;
      }
      c4++;
    }
  }
  static createElement(t4, i6) {
    const s3 = r3.createElement("template");
    return s3.innerHTML = t4, s3;
  }
};
function S2(t4, i6, s3 = t4, e8) {
  if (i6 === T) return i6;
  let h3 = void 0 !== e8 ? s3._$Co?.[e8] : s3._$Cl;
  const o6 = c3(i6) ? void 0 : i6._$litDirective$;
  return h3?.constructor !== o6 && (h3?._$AO?.(false), void 0 === o6 ? h3 = void 0 : (h3 = new o6(t4), h3._$AT(t4, s3, e8)), void 0 !== e8 ? (s3._$Co ?? (s3._$Co = []))[e8] = h3 : s3._$Cl = h3), void 0 !== h3 && (i6 = S2(t4, h3._$AS(t4, i6.values), h3, e8)), i6;
}
var M = class {
  constructor(t4, i6) {
    this._$AV = [], this._$AN = void 0, this._$AD = t4, this._$AM = i6;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t4) {
    const { el: { content: i6 }, parts: s3 } = this._$AD, e8 = (t4?.creationScope ?? r3).importNode(i6, true);
    C.currentNode = e8;
    let h3 = C.nextNode(), o6 = 0, n6 = 0, l3 = s3[0];
    for (; void 0 !== l3; ) {
      if (o6 === l3.index) {
        let i7;
        2 === l3.type ? i7 = new R(h3, h3.nextSibling, this, t4) : 1 === l3.type ? i7 = new l3.ctor(h3, l3.name, l3.strings, this, t4) : 6 === l3.type && (i7 = new z(h3, this, t4)), this._$AV.push(i7), l3 = s3[++n6];
      }
      o6 !== l3?.index && (h3 = C.nextNode(), o6++);
    }
    return C.currentNode = r3, e8;
  }
  p(t4) {
    let i6 = 0;
    for (const s3 of this._$AV) void 0 !== s3 && (void 0 !== s3.strings ? (s3._$AI(t4, s3, i6), i6 += s3.strings.length - 2) : s3._$AI(t4[i6])), i6++;
  }
};
var R = class _R {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t4, i6, s3, e8) {
    this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t4, this._$AB = i6, this._$AM = s3, this.options = e8, this._$Cv = e8?.isConnected ?? true;
  }
  get parentNode() {
    let t4 = this._$AA.parentNode;
    const i6 = this._$AM;
    return void 0 !== i6 && 11 === t4?.nodeType && (t4 = i6.parentNode), t4;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t4, i6 = this) {
    t4 = S2(this, t4, i6), c3(t4) ? t4 === E || null == t4 || "" === t4 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t4 !== this._$AH && t4 !== T && this._(t4) : void 0 !== t4._$litType$ ? this.$(t4) : void 0 !== t4.nodeType ? this.T(t4) : u2(t4) ? this.k(t4) : this._(t4);
  }
  O(t4) {
    return this._$AA.parentNode.insertBefore(t4, this._$AB);
  }
  T(t4) {
    this._$AH !== t4 && (this._$AR(), this._$AH = this.O(t4));
  }
  _(t4) {
    this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t4 : this.T(r3.createTextNode(t4)), this._$AH = t4;
  }
  $(t4) {
    const { values: i6, _$litType$: s3 } = t4, e8 = "number" == typeof s3 ? this._$AC(t4) : (void 0 === s3.el && (s3.el = N.createElement(P(s3.h, s3.h[0]), this.options)), s3);
    if (this._$AH?._$AD === e8) this._$AH.p(i6);
    else {
      const t5 = new M(e8, this), s4 = t5.u(this.options);
      t5.p(i6), this.T(s4), this._$AH = t5;
    }
  }
  _$AC(t4) {
    let i6 = A.get(t4.strings);
    return void 0 === i6 && A.set(t4.strings, i6 = new N(t4)), i6;
  }
  k(t4) {
    a2(this._$AH) || (this._$AH = [], this._$AR());
    const i6 = this._$AH;
    let s3, e8 = 0;
    for (const h3 of t4) e8 === i6.length ? i6.push(s3 = new _R(this.O(l2()), this.O(l2()), this, this.options)) : s3 = i6[e8], s3._$AI(h3), e8++;
    e8 < i6.length && (this._$AR(s3 && s3._$AB.nextSibling, e8), i6.length = e8);
  }
  _$AR(t4 = this._$AA.nextSibling, i6) {
    for (this._$AP?.(false, true, i6); t4 && t4 !== this._$AB; ) {
      const i7 = t4.nextSibling;
      t4.remove(), t4 = i7;
    }
  }
  setConnected(t4) {
    void 0 === this._$AM && (this._$Cv = t4, this._$AP?.(t4));
  }
};
var k = class {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t4, i6, s3, e8, h3) {
    this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t4, this.name = i6, this._$AM = e8, this.options = h3, s3.length > 2 || "" !== s3[0] || "" !== s3[1] ? (this._$AH = Array(s3.length - 1).fill(new String()), this.strings = s3) : this._$AH = E;
  }
  _$AI(t4, i6 = this, s3, e8) {
    const h3 = this.strings;
    let o6 = false;
    if (void 0 === h3) t4 = S2(this, t4, i6, 0), o6 = !c3(t4) || t4 !== this._$AH && t4 !== T, o6 && (this._$AH = t4);
    else {
      const e9 = t4;
      let n6, r8;
      for (t4 = h3[0], n6 = 0; n6 < h3.length - 1; n6++) r8 = S2(this, e9[s3 + n6], i6, n6), r8 === T && (r8 = this._$AH[n6]), o6 || (o6 = !c3(r8) || r8 !== this._$AH[n6]), r8 === E ? t4 = E : t4 !== E && (t4 += (r8 ?? "") + h3[n6 + 1]), this._$AH[n6] = r8;
    }
    o6 && !e8 && this.j(t4);
  }
  j(t4) {
    t4 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t4 ?? "");
  }
};
var H = class extends k {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t4) {
    this.element[this.name] = t4 === E ? void 0 : t4;
  }
};
var I = class extends k {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t4) {
    this.element.toggleAttribute(this.name, !!t4 && t4 !== E);
  }
};
var L = class extends k {
  constructor(t4, i6, s3, e8, h3) {
    super(t4, i6, s3, e8, h3), this.type = 5;
  }
  _$AI(t4, i6 = this) {
    if ((t4 = S2(this, t4, i6, 0) ?? E) === T) return;
    const s3 = this._$AH, e8 = t4 === E && s3 !== E || t4.capture !== s3.capture || t4.once !== s3.once || t4.passive !== s3.passive, h3 = t4 !== E && (s3 === E || e8);
    e8 && this.element.removeEventListener(this.name, this, s3), h3 && this.element.addEventListener(this.name, this, t4), this._$AH = t4;
  }
  handleEvent(t4) {
    "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t4) : this._$AH.handleEvent(t4);
  }
};
var z = class {
  constructor(t4, i6, s3) {
    this.element = t4, this.type = 6, this._$AN = void 0, this._$AM = i6, this.options = s3;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t4) {
    S2(this, t4);
  }
};
var j = t2.litHtmlPolyfillSupport;
j?.(N, R), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.2.1");
var B = (t4, i6, s3) => {
  const e8 = s3?.renderBefore ?? i6;
  let h3 = e8._$litPart$;
  if (void 0 === h3) {
    const t5 = s3?.renderBefore ?? null;
    e8._$litPart$ = h3 = new R(i6.insertBefore(l2(), t5), t5, void 0, s3 ?? {});
  }
  return h3._$AI(t4), h3;
};

// node_modules/.pnpm/lit-element@4.1.1/node_modules/lit-element/lit-element.js
var r4 = class extends b {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t4 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t4.firstChild), t4;
  }
  update(t4) {
    const s3 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t4), this._$Do = B(s3, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(true);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(false);
  }
  render() {
    return T;
  }
};
r4._$litElement$ = true, r4["finalized"] = true, globalThis.litElementHydrateSupport?.({ LitElement: r4 });
var i4 = globalThis.litElementPolyfillSupport;
i4?.({ LitElement: r4 });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.1.1");

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/property.js
var o4 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
var r5 = (t4 = o4, e8, r8) => {
  const { kind: n6, metadata: i6 } = r8;
  let s3 = globalThis.litPropertyMetadata.get(i6);
  if (void 0 === s3 && globalThis.litPropertyMetadata.set(i6, s3 = /* @__PURE__ */ new Map()), s3.set(r8.name, t4), "accessor" === n6) {
    const { name: o6 } = r8;
    return { set(r9) {
      const n7 = e8.get.call(this);
      e8.set.call(this, r9), this.requestUpdate(o6, n7, t4);
    }, init(e9) {
      return void 0 !== e9 && this.P(o6, void 0, t4), e9;
    } };
  }
  if ("setter" === n6) {
    const { name: o6 } = r8;
    return function(r9) {
      const n7 = this[o6];
      e8.call(this, r9), this.requestUpdate(o6, n7, t4);
    };
  }
  throw Error("Unsupported decorator location: " + n6);
};
function n4(t4) {
  return (e8, o6) => "object" == typeof o6 ? r5(t4, e8, o6) : ((t5, e9, o7) => {
    const r8 = e9.hasOwnProperty(o7);
    return e9.constructor.createProperty(o7, r8 ? { ...t5, wrapped: true } : t5), r8 ? Object.getOwnPropertyDescriptor(e9, o7) : void 0;
  })(t4, e8, o6);
}

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/state.js
function r6(r8) {
  return n4({ ...r8, state: true, attribute: false });
}

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/base.js
var e4 = (e8, t4, c4) => (c4.configurable = true, c4.enumerable = true, Reflect.decorate && "object" != typeof t4 && Object.defineProperty(e8, t4, c4), c4);

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query-all.js
var e5;
function r7(r8) {
  return (n6, o6) => e4(n6, o6, { get() {
    return (this.renderRoot ?? (e5 ?? (e5 = document.createDocumentFragment()))).querySelectorAll(r8);
  } });
}

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directive.js
var t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var e6 = (t4) => (...e8) => ({ _$litDirective$: t4, values: e8 });
var i5 = class {
  constructor(t4) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t4, e8, i6) {
    this._$Ct = t4, this._$AM = e8, this._$Ci = i6;
  }
  _$AS(t4, e8) {
    return this.update(t4, e8);
  }
  update(t4, e8) {
    return this.render(...e8);
  }
};

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/class-map.js
var e7 = e6(class extends i5 {
  constructor(t4) {
    if (super(t4), t4.type !== t3.ATTRIBUTE || "class" !== t4.name || t4.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t4) {
    return " " + Object.keys(t4).filter((s3) => t4[s3]).join(" ") + " ";
  }
  update(s3, [i6]) {
    if (void 0 === this.st) {
      this.st = /* @__PURE__ */ new Set(), void 0 !== s3.strings && (this.nt = new Set(s3.strings.join(" ").split(/\s/).filter((t4) => "" !== t4)));
      for (const t4 in i6) i6[t4] && !this.nt?.has(t4) && this.st.add(t4);
      return this.render(i6);
    }
    const r8 = s3.element.classList;
    for (const t4 of this.st) t4 in i6 || (r8.remove(t4), this.st.delete(t4));
    for (const t4 in i6) {
      const s4 = !!i6[t4];
      s4 === this.st.has(t4) || this.nt?.has(t4) || (s4 ? (r8.add(t4), this.st.add(t4)) : (r8.remove(t4), this.st.delete(t4)));
    }
    return T;
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/map.js
function* o5(o6, f3) {
  if (void 0 !== o6) {
    let i6 = 0;
    for (const t4 of o6) yield f3(t4, i6++);
  }
}

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/when.js
function n5(n6, r8, t4) {
  return n6 ? r8(n6) : t4?.(n6);
}

// node_modules/.pnpm/@alenaksu+json-viewer@2.1.2_patch_hash=h6d5ny7gzeg2cflvjmbgs5cxte/node_modules/@alenaksu/json-viewer/dist/chunk-6HJCMUMX.js
var __defProp2 = Object.defineProperty;
var __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc2(target, key) : target;
  for (var i6 = decorators.length - 1, decorator; i6 >= 0; i6--)
    if (decorator = decorators[i6])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp2(target, key, result);
  return result;
};
function isRegex(value) {
  return value instanceof RegExp;
}
function getType(value) {
  return value === null ? "null" : Array.isArray(value) ? "array" : value.constructor.name.toLowerCase();
}
function isPrimitive(value) {
  return value !== Object(value);
}
function generateNodePreview(node, { nodeCount = 3, maxLength = 15 } = {}) {
  const isArray = Array.isArray(node);
  const objectNodes = Object.keys(node);
  const keys = objectNodes.slice(0, nodeCount);
  const preview = [];
  const getNodePreview = (nodeValue) => {
    const nodeType = getType(nodeValue);
    switch (nodeType) {
      case "object":
        return Object.keys(nodeValue).length === 0 ? "{ }" : "{ ... }";
      case "array":
        return nodeValue.length === 0 ? "[ ]" : "[ ... ]";
      case "string":
        return `"${nodeValue.substring(0, maxLength)}${nodeValue.length > maxLength ? "..." : ""}"`;
      default:
        return String(nodeValue);
    }
  };
  const childPreviews = [];
  for (const key of keys) {
    const nodePreview = [];
    const nodeValue = node[key];
    if (!isArray) nodePreview.push(`${key}: `);
    nodePreview.push(getNodePreview(nodeValue));
    childPreviews.push(nodePreview.join(""));
  }
  if (objectNodes.length > nodeCount) {
    childPreviews.push("...");
  }
  preview.push(childPreviews.join(", "));
  const previewText = preview.join("");
  return isArray ? `[ ${previewText} ]` : `{ ${previewText} }`;
}
function* deepTraverse(obj) {
  const stack = [[obj, "", []]];
  while (stack.length) {
    const [node, path, parents] = stack.shift();
    if (path) {
      yield [node, path, parents];
    }
    if (!isPrimitive(node)) {
      for (const [key, value] of Object.entries(node)) {
        stack.push([value, `${path}${path ? "." : ""}${key}`, [...parents, path]]);
      }
    }
  }
}
function checkGlob(str, glob) {
  const strParts = str.split(".");
  const globaParts = glob.split(".");
  const isStar = (s3) => s3 === "*";
  const isGlobStar = (s3) => s3 === "**";
  let strIndex = 0;
  let globIndex = 0;
  while (strIndex < strParts.length) {
    const globPart = globaParts[globIndex];
    const strPart = strParts[strIndex];
    if (globPart === strPart || isStar(globPart)) {
      globIndex++;
      strIndex++;
    } else if (isGlobStar(globPart)) {
      globIndex++;
      strIndex = strParts.length - (globaParts.length - globIndex);
    } else {
      return false;
    }
  }
  return globIndex === globaParts.length;
}
var JSONConverter = {
  fromAttribute: (value) => {
    return value && value.trim() ? JSON.parse(value) : void 0;
  },
  toAttribute: (value) => {
    return JSON.stringify(value);
  }
};
var isDefined = (value) => value !== void 0;
var isMatchingPath = (path, criteria) => isRegex(criteria) ? !!path.match(criteria) : checkGlob(path, criteria);
var getValueByPath = (json, path) => path.split(".").reduce((acc, key) => acc[key], json);
var toggleNode = (path, expanded) => (state2) => ({
  expanded: {
    ...state2.expanded,
    [path]: isDefined(expanded) ? !!expanded : !state2.expanded[path]
  }
});
var expand = (regexOrGlob, isExpanded) => (_state, el) => {
  const expanded = {};
  if (regexOrGlob) {
    for (const [, path, parents] of deepTraverse(el.data)) {
      if (isMatchingPath(path, regexOrGlob)) {
        expanded[path] = isExpanded;
        parents.forEach((p3) => expanded[p3] = isExpanded);
      }
    }
  }
  return { expanded };
};
var filter = (regexOrGlob) => (_state, el) => {
  const filtered = {};
  if (regexOrGlob) {
    for (const [, path, parents] of deepTraverse(el.data)) {
      if (isMatchingPath(path, regexOrGlob)) {
        filtered[path] = false;
        parents.forEach((p3) => filtered[p3] = false);
      } else {
        filtered[path] = true;
      }
    }
  }
  return { filtered };
};
var resetFilter = () => () => ({ filtered: {} });
var highlight = (path) => () => ({
  highlight: path
});
var JsonViewer_styles_default = i`
    :where(:host) {
        --background-color: #2a2f3a;
        --color: #f8f8f2;
        --string-color: #a3eea0;
        --number-color: #d19a66;
        --boolean-color: #4ba7ef;
        --null-color: #df9cf3;
        --property-color: #6fb3d2;
        --preview-color: rgba(222, 175, 143, 0.9);
        --highlight-color:  #c92a2a;
        --outline-color: #e0e4e5;
        --outline-width: 1px;
        --outline-style: dotted;

        --font-family: Nimbus Mono PS, Courier New, monospace;
        --font-size: 1rem;
        --line-height: 1.2rem;

        --indent-size: 0.5rem;
        --indentguide-size: 1px;
        --indentguide-style: solid;
        --indentguide-color: #495057;
        --indentguide-color-active: #ced4da;
        --indentguide: var(--indentguide-size) var(--indentguide-style) var(--indentguide-color);
        --indentguide-active: var(--indentguide-size) var(--indentguide-style) var(--indentguide-color-active);
    }

    :host {
        display: block;
        background-color: var(--background-color);
        color: var(--color);
        font-family: var(--font-family);
        font-size: var(--font-size);
        line-height: var(--line-height);
    }

    :focus {
        outline-color: var(--outline-color);
        outline-width: var(--outline-width);
        outline-style: var(--outline-style);
    }

    .preview {
        color: var(--preview-color);
    }

    .null {
        color: var(--null-color);
    }

    .key {
        color: var(--property-color);
        display: inline-flex;
        align-items: flex-start;
    }

    .collapsable::before {
        display: inline-flex;
        font-size: 0.8em;
        content: '▶';
        width: var(--line-height);
        height: var(--line-height);
        align-items: center;
        justify-content: center;

        transition: transform 195ms ease-out;
        transform: rotate(90deg);

        color: inherit;
    }

    .collapsable--collapsed::before {
        transform: rotate(0);
    }

    .collapsable {
        cursor: pointer;
        user-select: none;
    }

    .string {
        color: var(--string-color);
    }

    .number {
        color: var(--number-color);
    }

    .boolean {
        color: var(--boolean-color);
    }

    ul {
        padding: 0;
        clear: both;
    }

    ul,
    li {
        list-style: none;
        position: relative;
    }

    li ul > li {
        position: relative;
        margin-left: calc(var(--indent-size) + var(--line-height));
        padding-left: 0px;
    }

    ul ul::before {
        content: '';
        border-left: var(--indentguide);
        position: absolute;
        left: calc(var(--line-height) / 2 - var(--indentguide-size));
        top: 0.2rem;
        bottom: 0.2rem;
    }

    ul ul:hover::before {
        border-left: var(--indentguide-active);
    }

    mark {
        background-color: var(--highlight-color);
    }
`;
var _handlePropertyClick, _handleFocusIn, _handleFocusOut, __this_instances, handleKeyDown_fn, focusItem_fn, _a;
var JsonViewer = (_a = class extends r4 {
  constructor() {
    super();
    __privateAdd(this, __this_instances);
    __privateAdd(this, _handlePropertyClick);
    __privateAdd(this, _handleFocusIn);
    __privateAdd(this, _handleFocusOut);
    this.state = {
      expanded: {},
      filtered: {},
      highlight: null
    };
    this.lastFocusedItem = null;
    __privateSet(this, _handlePropertyClick, (path) => (e8) => {
      e8.preventDefault();
      this.setState(toggleNode(path));
    });
    __privateSet(this, _handleFocusIn, (event) => {
      const target = event.target;
      if (event.target === this) {
        __privateMethod(this, __this_instances, focusItem_fn).call(this, this.lastFocusedItem || this.nodeElements[0]);
      }
      if (target.matches('[role="treeitem"]')) {
        if (this.lastFocusedItem) {
          this.lastFocusedItem.tabIndex = -1;
        }
        this.lastFocusedItem = target;
        this.tabIndex = -1;
        target.tabIndex = 0;
      }
    });
    __privateSet(this, _handleFocusOut, (event) => {
      const relatedTarget = event.relatedTarget;
      if (!relatedTarget || !this.contains(relatedTarget)) {
        this.tabIndex = 0;
      }
    });
    this.addEventListener("focusin", __privateGet(this, _handleFocusIn));
    this.addEventListener("focusout", __privateGet(this, _handleFocusOut));
  }
  static customRenderer(value, _path) {
    return JSON.stringify(value);
  }
  async setState(stateFn) {
    const currentState = this.state;
    this.state = {
      ...currentState,
      ...stateFn(currentState, this)
    };
  }
  connectedCallback() {
    if (!this.hasAttribute("data") && !isDefined(this.data)) {
      this.setAttribute("data", this.innerText);
    }
    this.setAttribute("role", "node");
    this.setAttribute("tabindex", "0");
    super.connectedCallback();
  }
  expand(glob) {
    this.setState(expand(glob, true));
  }
  expandAll() {
    this.setState(expand("**", true));
  }
  collapseAll() {
    this.setState(expand("**", false));
  }
  collapse(glob) {
    this.setState(expand(glob, false));
  }
  *search(criteria) {
    for (const [node, path] of deepTraverse(this.data)) {
      if (isPrimitive(node) && String(node).toLowerCase().includes(criteria.toLowerCase()) || String(path).toLowerCase().includes(criteria.toLowerCase())) {
        this.expand(path);
        this.updateComplete.then(() => {
          const node2 = this.shadowRoot.querySelector(`[data-path="${path}"]`);
          node2.scrollIntoView({
            behavior: "smooth",
            inline: "center",
            block: "center"
          });
          node2.focus();
        });
        this.setState(highlight(path));
        yield {
          value: node,
          path
        };
      }
    }
    this.setState(highlight(null));
  }
  filter(criteria) {
    this.setState(filter(criteria));
  }
  resetFilter() {
    this.setState(resetFilter());
  }
  renderObject(node, path) {
    return x`
            <ul part="object" role="group">
                ${o5(Object.entries(node), ([key, nodeData]) => {
      const nodePath = path ? `${path}.${key}` : key;
      const isPrimitiveNode = isPrimitive(nodeData);
      const isExpanded = this.state.expanded[nodePath];
      const isFiltered = this.state.filtered[nodePath];
      return isFiltered ? E : x`
                              <li
                                  part="property"
                                  role="treeitem"
                                  data-path="${nodePath}"
                                  aria-expanded="${isExpanded ? "true" : "false"}"
                                  tabindex="-1"
                                  .hidden="${this.state.filtered[nodePath]}"
                                  aria-hidden="${this.state.filtered[nodePath]}"
                              >
                                  <span
                                      part="key"
                                      class="${e7({
        key,
        collapsable: !isPrimitiveNode,
        ["collapsable--collapsed"]: !this.state.expanded[nodePath]
      })}"
                                      @click="${!isPrimitiveNode ? __privateGet(this, _handlePropertyClick).call(this, nodePath) : null}"
                                  >
                                      ${key}:
                                      ${n5(!isPrimitiveNode && !isExpanded, () => this.renderNodePreview(nodeData))}
                                  </span>

                                  ${n5(isPrimitiveNode || isExpanded, () => this.renderValue(nodeData, nodePath))}
                              </li>
                          `;
    })}
            </ul>
        `;
  }
  renderValue(value, path = "") {
    if (isPrimitive(value)) {
      return this.renderPrimitive(value, path);
    }
    return this.renderObject(value, path);
  }
  renderNodePreview(node) {
    return x`<span part="preview" class="preview"> ${generateNodePreview(node)} </span>`;
  }
  renderPrimitive(node, path) {
    const highlight2 = this.state.highlight;
    const nodeType = getType(node);
    const renderedValue = this.constructor.customRenderer(node, path);
    const primitiveNode = x`
            <span part="primitive primitive-${nodeType}" class="${getType(node)}"> ${renderedValue} </span>
        `;
    return path === highlight2 ? x`<mark part="highlight">${primitiveNode}</mark>` : primitiveNode;
  }
  render() {
    const data = this.data;
    return x`
            <div
                part="base"
                @keydown=${__privateMethod(this, __this_instances, handleKeyDown_fn)}
                @focusin="${__privateGet(this, _handleFocusIn)}"
                @focusout="${__privateGet(this, _handleFocusOut)}"
            >
                ${n5(isDefined(data), () => this.renderValue(data))}
            </div>
        `;
  }
}, _handlePropertyClick = new WeakMap(), _handleFocusIn = new WeakMap(), _handleFocusOut = new WeakMap(), __this_instances = new WeakSet(), handleKeyDown_fn = function(event) {
  if (!["ArrowDown", "ArrowUp", "ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
    return;
  }
  const nodes = [...this.nodeElements];
  const isLtr = this.matches(":dir(ltr)");
  const isRtl = this.matches(":dir(rtl)");
  if (nodes.length > 0) {
    event.preventDefault();
    const activeItemIndex = nodes.findIndex((item) => item.matches(":focus"));
    const activeItem = nodes[activeItemIndex];
    const isExpanded = this.state.expanded[activeItem.dataset.path];
    const isLeaf = isPrimitive(getValueByPath(this.data, activeItem.dataset.path));
    const focusItemAt = (index) => {
      const item = nodes[Math.max(Math.min(index, nodes.length - 1), 0)];
      __privateMethod(this, __this_instances, focusItem_fn).call(this, item);
    };
    const toggleExpand = (expanded) => {
      this.setState(toggleNode(activeItem.dataset.path, expanded));
    };
    if (event.key === "ArrowDown") {
      focusItemAt(activeItemIndex + 1);
    } else if (event.key === "ArrowUp") {
      focusItemAt(activeItemIndex - 1);
    } else if (isLtr && event.key === "ArrowRight" || isRtl && event.key === "ArrowLeft") {
      if (!activeItem || isExpanded || isLeaf) {
        focusItemAt(activeItemIndex + 1);
      } else {
        toggleExpand(true);
      }
    } else if (isLtr && event.key === "ArrowLeft" || isRtl && event.key === "ArrowRight") {
      if (!activeItem || !isExpanded || isLeaf) {
        focusItemAt(activeItemIndex - 1);
      } else {
        toggleExpand(false);
      }
    } else if (event.key === "Home") {
      focusItemAt(0);
    } else if (event.key === "End") {
      focusItemAt(nodes.length - 1);
    }
  }
}, focusItem_fn = function(item) {
  item.focus();
}, _a.styles = [JsonViewer_styles_default], _a);
__decorateClass([
  n4({ converter: JSONConverter, type: Object })
], JsonViewer.prototype, "data", 2);
__decorateClass([
  r6()
], JsonViewer.prototype, "state", 2);
__decorateClass([
  r6()
], JsonViewer.prototype, "lastFocusedItem", 2);
__decorateClass([
  r7('[role="treeitem"]')
], JsonViewer.prototype, "nodeElements", 2);

// node_modules/.pnpm/@alenaksu+json-viewer@2.1.2_patch_hash=h6d5ny7gzeg2cflvjmbgs5cxte/node_modules/@alenaksu/json-viewer/dist/json-viewer.js
customElements.define("json-viewer", JsonViewer);

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/assets/icons/eye-fill.svg
var eye_fill_default = "../eye-fill-RBTRTZO3.svg";

// node_modules/.pnpm/bigger-picture@1.1.18/node_modules/bigger-picture/dist/bigger-picture.mjs
function noop() {
}
var identity = (x2) => x2;
function assign(tar, src) {
  for (const k2 in src)
    tar[k2] = src[k2];
  return tar;
}
function run(fn) {
  return fn();
}
function run_all(fns) {
  fns.forEach(run);
}
function is_function(thing) {
  return typeof thing === "function";
}
function not_equal(a3, b3) {
  return a3 != a3 ? b3 == b3 : a3 !== b3;
}
function is_empty(obj) {
  return Object.keys(obj).length === 0;
}
function subscribe(store, ...callbacks) {
  if (store == null) {
    return noop;
  }
  const unsub = store.subscribe(...callbacks);
  return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function component_subscribe(component, store, callback) {
  component.$$.on_destroy.push(subscribe(store, callback));
}
function action_destroyer(action_result) {
  return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
}
var now = () => globalThis.performance.now();
var raf = (cb) => requestAnimationFrame(cb);
var tasks = /* @__PURE__ */ new Set();
function run_tasks(now2) {
  tasks.forEach((task) => {
    if (!task.c(now2)) {
      tasks.delete(task);
      task.f();
    }
  });
  if (tasks.size !== 0)
    raf(run_tasks);
}
function loop(callback) {
  let task;
  if (tasks.size === 0)
    raf(run_tasks);
  return {
    promise: new Promise((fulfill) => {
      tasks.add(task = { c: callback, f: fulfill });
    }),
    abort() {
      tasks.delete(task);
    }
  };
}
function append(target, node) {
  target.appendChild(node);
}
function insert(target, node, anchor) {
  target.insertBefore(node, anchor || null);
}
function detach(node) {
  node.parentNode.removeChild(node);
}
function element(name) {
  return document.createElement(name);
}
function text(data) {
  return document.createTextNode(data);
}
function empty() {
  return text("");
}
function listen(node, event, handler, options) {
  node.addEventListener(event, handler, options);
  return () => node.removeEventListener(event, handler, options);
}
function attr(node, attribute, value) {
  if (value == null)
    node.removeAttribute(attribute);
  else if (node.getAttribute(attribute) !== value)
    node.setAttribute(attribute, value);
}
function set_style(node, key, value, important) {
  if (value === null) {
    node.style.removeProperty(key);
  } else {
    node.style.setProperty(key, value);
  }
}
function toggle_class(element2, name, toggle) {
  element2.classList[toggle ? "add" : "remove"](name);
}
function custom_event(type, detail, bubbles = false) {
  const e8 = document.createEvent("CustomEvent");
  e8.initCustomEvent(type, bubbles, false, detail);
  return e8;
}
var stylesheet;
var active = 0;
var current_rules = {};
function create_rule(node, a3, b3, duration, delay, ease, fn, uid = 0) {
  const step = 16.666 / duration;
  let keyframes = "{\n";
  for (let p3 = 0; p3 <= 1; p3 += step) {
    const t4 = a3 + (b3 - a3) * ease(p3);
    keyframes += p3 * 100 + `%{${fn(t4, 1 - t4)}}
`;
  }
  const rule = keyframes + `100% {${fn(b3, 1 - b3)}}
}`;
  const name = `_bp_${Math.round(Math.random() * 1e9)}_${uid}`;
  if (!current_rules[name]) {
    if (!stylesheet) {
      const style = element("style");
      document.head.appendChild(style);
      stylesheet = style.sheet;
    }
    current_rules[name] = true;
    stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
  }
  const animation = node.style.animation || "";
  node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
  active += 1;
  return name;
}
function delete_rule(node, name) {
  node.style.animation = (node.style.animation || "").split(", ").filter(
    name ? (anim) => anim.indexOf(name) < 0 : (anim) => anim.indexOf("_bp") === -1
    // remove all Svelte animations
  ).join(", ");
  if (name && !--active)
    clear_rules();
}
function clear_rules() {
  raf(() => {
    if (active)
      return;
    let i6 = stylesheet.cssRules.length;
    while (i6--)
      stylesheet.deleteRule(i6);
    current_rules = {};
  });
}
var current_component;
function set_current_component(component) {
  current_component = component;
}
var dirty_components = [];
var binding_callbacks = [];
var render_callbacks = [];
var flush_callbacks = [];
var resolved_promise = Promise.resolve();
var update_scheduled = false;
function schedule_update() {
  if (!update_scheduled) {
    update_scheduled = true;
    resolved_promise.then(flush);
  }
}
function add_render_callback(fn) {
  render_callbacks.push(fn);
}
var seen_callbacks = /* @__PURE__ */ new Set();
var flushidx = 0;
function flush() {
  const saved_component = current_component;
  do {
    while (flushidx < dirty_components.length) {
      const component = dirty_components[flushidx];
      flushidx++;
      set_current_component(component);
      update(component.$$);
    }
    set_current_component(null);
    dirty_components.length = 0;
    flushidx = 0;
    while (binding_callbacks.length)
      binding_callbacks.pop()();
    for (let i6 = 0; i6 < render_callbacks.length; i6 += 1) {
      const callback = render_callbacks[i6];
      if (!seen_callbacks.has(callback)) {
        seen_callbacks.add(callback);
        callback();
      }
    }
    render_callbacks.length = 0;
  } while (dirty_components.length);
  while (flush_callbacks.length) {
    flush_callbacks.pop()();
  }
  update_scheduled = false;
  seen_callbacks.clear();
  set_current_component(saved_component);
}
function update($$) {
  if ($$.fragment !== null) {
    $$.update();
    run_all($$.before_update);
    const dirty = $$.dirty;
    $$.dirty = [-1];
    $$.fragment && $$.fragment.p($$.ctx, dirty);
    $$.after_update.forEach(add_render_callback);
  }
}
var promise;
function wait() {
  if (!promise) {
    promise = Promise.resolve();
    promise.then(() => {
      promise = null;
    });
  }
  return promise;
}
function dispatch(node, direction, kind) {
  node.dispatchEvent(custom_event(`${direction ? "intro" : "outro"}${kind}`));
}
var outroing = /* @__PURE__ */ new Set();
var outros;
function group_outros() {
  outros = {
    r: 0,
    c: [],
    p: outros
    // parent group
  };
}
function check_outros() {
  if (!outros.r) {
    run_all(outros.c);
  }
  outros = outros.p;
}
function transition_in(block, local) {
  if (block && block.i) {
    outroing.delete(block);
    block.i(local);
  }
}
function transition_out(block, local, detach2, callback) {
  if (block && block.o) {
    if (outroing.has(block))
      return;
    outroing.add(block);
    outros.c.push(() => {
      outroing.delete(block);
      if (callback) {
        if (detach2)
          block.d(1);
        callback();
      }
    });
    block.o(local);
  }
}
var null_transition = { duration: 0 };
function create_in_transition(node, fn, params) {
  let config = fn(node, params);
  let running = false;
  let animation_name;
  let task;
  let uid = 0;
  function cleanup() {
    if (animation_name)
      delete_rule(node, animation_name);
  }
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
    tick(0, 1);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    if (task)
      task.abort();
    running = true;
    add_render_callback(() => dispatch(node, true, "start"));
    task = loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(1, 0);
          dispatch(node, true, "end");
          cleanup();
          return running = false;
        }
        if (now2 >= start_time) {
          const t4 = easing((now2 - start_time) / duration);
          tick(t4, 1 - t4);
        }
      }
      return running;
    });
  }
  let started = false;
  return {
    start() {
      if (started)
        return;
      started = true;
      delete_rule(node);
      if (is_function(config)) {
        config = config();
        wait().then(go);
      } else {
        go();
      }
    },
    invalidate() {
      started = false;
    },
    end() {
      if (running) {
        cleanup();
        running = false;
      }
    }
  };
}
function create_out_transition(node, fn, params) {
  let config = fn(node, params);
  let running = true;
  let animation_name;
  const group = outros;
  group.r += 1;
  function go() {
    const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
    if (css)
      animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
    const start_time = now() + delay;
    const end_time = start_time + duration;
    add_render_callback(() => dispatch(node, false, "start"));
    loop((now2) => {
      if (running) {
        if (now2 >= end_time) {
          tick(0, 1);
          dispatch(node, false, "end");
          if (!--group.r) {
            run_all(group.c);
          }
          return false;
        }
        if (now2 >= start_time) {
          const t4 = easing((now2 - start_time) / duration);
          tick(1 - t4, t4);
        }
      }
      return running;
    });
  }
  if (is_function(config)) {
    wait().then(() => {
      config = config();
      go();
    });
  } else {
    go();
  }
  return {
    end(reset) {
      if (reset && config.tick) {
        config.tick(1, 0);
      }
      if (running) {
        if (animation_name)
          delete_rule(node, animation_name);
        running = false;
      }
    }
  };
}
function create_component(block) {
  block && block.c();
}
function mount_component(component, target, anchor, customElement) {
  const { fragment, on_mount, on_destroy, after_update } = component.$$;
  fragment && fragment.m(target, anchor);
  if (!customElement) {
    add_render_callback(() => {
      const new_on_destroy = on_mount.map(run).filter(is_function);
      if (on_destroy) {
        on_destroy.push(...new_on_destroy);
      } else {
        run_all(new_on_destroy);
      }
      component.$$.on_mount = [];
    });
  }
  after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
  const $$ = component.$$;
  if ($$.fragment !== null) {
    run_all($$.on_destroy);
    $$.fragment && $$.fragment.d(detaching);
    $$.on_destroy = $$.fragment = null;
    $$.ctx = [];
  }
}
function make_dirty(component, i6) {
  if (component.$$.dirty[0] === -1) {
    dirty_components.push(component);
    schedule_update();
    component.$$.dirty.fill(0);
  }
  component.$$.dirty[i6 / 31 | 0] |= 1 << i6 % 31;
}
function init(component, options, instance2, create_fragment2, not_equal2, props, append_styles, dirty = [-1]) {
  const parent_component = current_component;
  set_current_component(component);
  const $$ = component.$$ = {
    fragment: null,
    ctx: null,
    // state
    props,
    update: noop,
    not_equal: not_equal2,
    bound: {},
    // lifecycle
    on_mount: [],
    on_destroy: [],
    on_disconnect: [],
    before_update: [],
    after_update: [],
    context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
    // everything else
    callbacks: {},
    dirty,
    skip_bound: false,
    root: options.target || parent_component.$$.root
  };
  append_styles && append_styles($$.root);
  let ready = false;
  $$.ctx = instance2 ? instance2(component, options.props || {}, (i6, ret, ...rest) => {
    const value = rest.length ? rest[0] : ret;
    if ($$.ctx && not_equal2($$.ctx[i6], $$.ctx[i6] = value)) {
      if (!$$.skip_bound && $$.bound[i6])
        $$.bound[i6](value);
      if (ready)
        make_dirty(component, i6);
    }
    return ret;
  }) : [];
  $$.update();
  ready = true;
  run_all($$.before_update);
  $$.fragment = create_fragment2 ? create_fragment2($$.ctx) : false;
  if (options.target) {
    {
      $$.fragment && $$.fragment.c();
    }
    mount_component(component, options.target, options.anchor, options.customElement);
    flush();
  }
  set_current_component(parent_component);
}
var SvelteComponent = class {
  $destroy() {
    destroy_component(this, 1);
    this.$destroy = noop;
  }
  $on(type, callback) {
    const callbacks = this.$$.callbacks[type] || (this.$$.callbacks[type] = []);
    callbacks.push(callback);
    return () => {
      const index = callbacks.indexOf(callback);
      if (index !== -1)
        callbacks.splice(index, 1);
    };
  }
  $set($$props) {
    if (this.$$set && !is_empty($$props)) {
      this.$$.skip_bound = true;
      this.$$set($$props);
      this.$$.skip_bound = false;
    }
  }
};
function cubicOut(t4) {
  const f3 = t4 - 1;
  return f3 * f3 * f3 + 1;
}
function fly(node, { delay = 0, duration = 400, easing = cubicOut, x: x2 = 0, y: y3 = 0, opacity = 0 } = {}) {
  const style = getComputedStyle(node);
  const target_opacity = +style.opacity;
  const transform = style.transform === "none" ? "" : style.transform;
  const od = target_opacity * (1 - opacity);
  return {
    delay,
    duration,
    easing,
    css: (t4, u3) => `
			transform: ${transform} translate(${(1 - t4) * x2}px, ${(1 - t4) * y3}px);
			opacity: ${target_opacity - od * u3}`
  };
}
var subscriber_queue = [];
function writable(value, start = noop) {
  let stop;
  const subscribers = /* @__PURE__ */ new Set();
  function set(new_value) {
    if (not_equal(value, new_value)) {
      value = new_value;
      if (stop) {
        const run_queue = !subscriber_queue.length;
        for (const subscriber of subscribers) {
          subscriber[1]();
          subscriber_queue.push(subscriber, value);
        }
        if (run_queue) {
          for (let i6 = 0; i6 < subscriber_queue.length; i6 += 2) {
            subscriber_queue[i6][0](subscriber_queue[i6 + 1]);
          }
          subscriber_queue.length = 0;
        }
      }
    }
  }
  function update2(fn) {
    set(fn(value));
  }
  function subscribe2(run2, invalidate = noop) {
    const subscriber = [run2, invalidate];
    subscribers.add(subscriber);
    if (subscribers.size === 1) {
      stop = start(set) || noop;
    }
    run2(value);
    return () => {
      subscribers.delete(subscriber);
      if (subscribers.size === 0) {
        stop();
        stop = null;
      }
    };
  }
  return { set, update: update2, subscribe: subscribe2 };
}
function get_interpolator(a3, b3) {
  if (a3 === b3 || a3 !== a3)
    return () => a3;
  const type = typeof a3;
  if (Array.isArray(a3)) {
    const arr = b3.map((bi, i6) => {
      return get_interpolator(a3[i6], bi);
    });
    return (t4) => arr.map((fn) => fn(t4));
  }
  if (type === "number") {
    const delta = b3 - a3;
    return (t4) => a3 + t4 * delta;
  }
}
function tweened(value, defaults = {}) {
  const store = writable(value);
  let task;
  let target_value = value;
  function set(new_value, opts) {
    if (value == null) {
      store.set(value = new_value);
      return Promise.resolve();
    }
    target_value = new_value;
    let previous_task = task;
    let started = false;
    let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
    if (duration === 0) {
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      store.set(value = target_value);
      return Promise.resolve();
    }
    const start = now() + delay;
    let fn;
    task = loop((now2) => {
      if (now2 < start)
        return true;
      if (!started) {
        fn = interpolate(value, new_value);
        if (typeof duration === "function")
          duration = duration(value, new_value);
        started = true;
      }
      if (previous_task) {
        previous_task.abort();
        previous_task = null;
      }
      const elapsed = now2 - start;
      if (elapsed > duration) {
        store.set(value = new_value);
        return false;
      }
      store.set(value = fn(easing(elapsed / duration)));
      return true;
    });
    return task.promise;
  }
  return {
    set,
    update: (fn, opts) => set(fn(target_value, value), opts),
    subscribe: store.subscribe
  };
}
var closing = writable(0);
var prefersReducedMotion = globalThis.matchMedia?.(
  "(prefers-reduced-motion: reduce)"
).matches;
var defaultTweenOptions = (duration) => ({
  easing: cubicOut,
  duration: prefersReducedMotion ? 0 : duration
});
var getThumbBackground = (activeItem) => !activeItem.thumb || `url(${activeItem.thumb})`;
var addAttributes = (node, obj) => {
  if (!obj) {
    return;
  }
  if (typeof obj === "string") {
    obj = JSON.parse(obj);
  }
  for (const key in obj) {
    node.setAttribute(key, obj[key]);
  }
};
function create_if_block_1$2(ctx) {
  let div;
  let div_outro;
  let current;
  return {
    c() {
      div = element("div");
      div.innerHTML = `<span class="bp-bar"></span><span class="bp-o"></span>`;
      attr(div, "class", "bp-load");
      set_style(div, "background-image", getThumbBackground(
        /*activeItem*/
        ctx[0]
      ));
    },
    m(target, anchor) {
      insert(target, div, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (dirty & /*activeItem*/
      1) {
        set_style(div, "background-image", getThumbBackground(
          /*activeItem*/
          ctx2[0]
        ));
      }
    },
    i(local) {
      if (current) return;
      if (div_outro) div_outro.end(1);
      current = true;
    },
    o(local) {
      if (local) {
        div_outro = create_out_transition(div, fly, { duration: 480 });
      }
      current = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      if (detaching && div_outro) div_outro.end();
    }
  };
}
function create_if_block$2(ctx) {
  let div;
  let div_intro;
  return {
    c() {
      div = element("div");
      attr(div, "class", "bp-load");
      set_style(div, "background-image", getThumbBackground(
        /*activeItem*/
        ctx[0]
      ));
    },
    m(target, anchor) {
      insert(target, div, anchor);
    },
    p(ctx2, dirty) {
      if (dirty & /*activeItem*/
      1) {
        set_style(div, "background-image", getThumbBackground(
          /*activeItem*/
          ctx2[0]
        ));
      }
    },
    i(local) {
      if (!div_intro) {
        add_render_callback(() => {
          div_intro = create_in_transition(div, fly, { duration: 480 });
          div_intro.start();
        });
      }
    },
    o: noop,
    d(detaching) {
      if (detaching) detach(div);
    }
  };
}
function create_fragment$4(ctx) {
  let if_block0_anchor;
  let if_block1_anchor;
  let if_block0 = !/*loaded*/
  ctx[1] && create_if_block_1$2(ctx);
  let if_block1 = (
    /*$closing*/
    ctx[2] && create_if_block$2(ctx)
  );
  return {
    c() {
      if (if_block0) if_block0.c();
      if_block0_anchor = empty();
      if (if_block1) if_block1.c();
      if_block1_anchor = empty();
    },
    m(target, anchor) {
      if (if_block0) if_block0.m(target, anchor);
      insert(target, if_block0_anchor, anchor);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
    },
    p(ctx2, [dirty]) {
      if (!/*loaded*/
      ctx2[1]) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty & /*loaded*/
          2) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$2(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(if_block0_anchor.parentNode, if_block0_anchor);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (
        /*$closing*/
        ctx2[2]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty & /*$closing*/
          4) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$2(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        if_block1.d(1);
        if_block1 = null;
      }
    },
    i(local) {
      transition_in(if_block0);
      transition_in(if_block1);
    },
    o(local) {
      transition_out(if_block0);
    },
    d(detaching) {
      if (if_block0) if_block0.d(detaching);
      if (detaching) detach(if_block0_anchor);
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(if_block1_anchor);
    }
  };
}
function instance$4($$self, $$props, $$invalidate) {
  let $closing;
  component_subscribe($$self, closing, ($$value) => $$invalidate(2, $closing = $$value));
  let { activeItem } = $$props;
  let { loaded } = $$props;
  $$self.$$set = ($$props2) => {
    if ("activeItem" in $$props2) $$invalidate(0, activeItem = $$props2.activeItem);
    if ("loaded" in $$props2) $$invalidate(1, loaded = $$props2.loaded);
  };
  return [activeItem, loaded, $closing];
}
var Loading = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$4, create_fragment$4, not_equal, { activeItem: 0, loaded: 1 });
  }
};
function create_if_block_1$1(ctx) {
  let img;
  let img_sizes_value;
  let img_outro;
  let current;
  let mounted;
  let dispose;
  return {
    c() {
      img = element("img");
      attr(img, "sizes", img_sizes_value = /*opts*/
      ctx[8].sizes || `${/*sizes*/
      ctx[1]}px`);
      attr(
        img,
        "alt",
        /*activeItem*/
        ctx[7].alt
      );
    },
    m(target, anchor) {
      insert(target, img, anchor);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(
            /*addSrc*/
            ctx[21].call(null, img)
          ),
          listen(
            img,
            "error",
            /*error_handler*/
            ctx[27]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (!current || dirty[0] & /*sizes*/
      2 && img_sizes_value !== (img_sizes_value = /*opts*/
      ctx2[8].sizes || `${/*sizes*/
      ctx2[1]}px`)) {
        attr(img, "sizes", img_sizes_value);
      }
    },
    i(local) {
      if (current) return;
      if (img_outro) img_outro.end(1);
      current = true;
    },
    o(local) {
      img_outro = create_out_transition(img, fly, {});
      current = false;
    },
    d(detaching) {
      if (detaching) detach(img);
      if (detaching && img_outro) img_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block$1(ctx) {
  let loading;
  let current;
  loading = new Loading({
    props: {
      activeItem: (
        /*activeItem*/
        ctx[7]
      ),
      loaded: (
        /*loaded*/
        ctx[2]
      )
    }
  });
  return {
    c() {
      create_component(loading.$$.fragment);
    },
    m(target, anchor) {
      mount_component(loading, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const loading_changes = {};
      if (dirty[0] & /*loaded*/
      4) loading_changes.loaded = /*loaded*/
      ctx2[2];
      loading.$set(loading_changes);
    },
    i(local) {
      if (current) return;
      transition_in(loading.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(loading.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(loading, detaching);
    }
  };
}
function create_fragment$3(ctx) {
  let div1;
  let div0;
  let if_block0_anchor;
  let style_transform = `translate3d(${/*$imageDimensions*/
  ctx[0][0] / -2 + /*$zoomDragTranslate*/
  ctx[6][0]}px, ${/*$imageDimensions*/
  ctx[0][1] / -2 + /*$zoomDragTranslate*/
  ctx[6][1]}px, 0)`;
  let current;
  let mounted;
  let dispose;
  let if_block0 = (
    /*loaded*/
    ctx[2] && create_if_block_1$1(ctx)
  );
  let if_block1 = (
    /*showLoader*/
    ctx[3] && create_if_block$1(ctx)
  );
  return {
    c() {
      div1 = element("div");
      div0 = element("div");
      if (if_block0) if_block0.c();
      if_block0_anchor = empty();
      if (if_block1) if_block1.c();
      attr(div0, "class", "bp-img");
      set_style(
        div0,
        "width",
        /*$imageDimensions*/
        ctx[0][0] + "px"
      );
      set_style(
        div0,
        "height",
        /*$imageDimensions*/
        ctx[0][1] + "px"
      );
      toggle_class(
        div0,
        "bp-drag",
        /*pointerDown*/
        ctx[4]
      );
      toggle_class(
        div0,
        "bp-canzoom",
        /*maxZoom*/
        ctx[11] > 1 && /*$imageDimensions*/
        ctx[0][0] < /*naturalWidth*/
        ctx[12]
      );
      set_style(div0, "background-image", getThumbBackground(
        /*activeItem*/
        ctx[7]
      ));
      set_style(div0, "transform", style_transform);
      attr(div1, "class", "bp-img-wrap");
      toggle_class(
        div1,
        "bp-close",
        /*closingWhileZoomed*/
        ctx[5]
      );
    },
    m(target, anchor) {
      insert(target, div1, anchor);
      append(div1, div0);
      if (if_block0) if_block0.m(div0, null);
      append(div0, if_block0_anchor);
      if (if_block1) if_block1.m(div0, null);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(
            /*onMount*/
            ctx[20].call(null, div0)
          ),
          listen(
            div1,
            "wheel",
            /*onWheel*/
            ctx[15]
          ),
          listen(
            div1,
            "pointerdown",
            /*onPointerDown*/
            ctx[16]
          ),
          listen(
            div1,
            "pointermove",
            /*onPointerMove*/
            ctx[17]
          ),
          listen(
            div1,
            "pointerup",
            /*onPointerUp*/
            ctx[19]
          ),
          listen(
            div1,
            "pointercancel",
            /*removeEventFromCache*/
            ctx[18]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (
        /*loaded*/
        ctx2[2]
      ) {
        if (if_block0) {
          if_block0.p(ctx2, dirty);
          if (dirty[0] & /*loaded*/
          4) {
            transition_in(if_block0, 1);
          }
        } else {
          if_block0 = create_if_block_1$1(ctx2);
          if_block0.c();
          transition_in(if_block0, 1);
          if_block0.m(div0, if_block0_anchor);
        }
      } else if (if_block0) {
        group_outros();
        transition_out(if_block0, 1, 1, () => {
          if_block0 = null;
        });
        check_outros();
      }
      if (
        /*showLoader*/
        ctx2[3]
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & /*showLoader*/
          8) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block$1(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(div0, null);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
      if (!current || dirty[0] & /*$imageDimensions*/
      1) {
        set_style(
          div0,
          "width",
          /*$imageDimensions*/
          ctx2[0][0] + "px"
        );
      }
      if (!current || dirty[0] & /*$imageDimensions*/
      1) {
        set_style(
          div0,
          "height",
          /*$imageDimensions*/
          ctx2[0][1] + "px"
        );
      }
      if (!current || dirty[0] & /*pointerDown*/
      16) {
        toggle_class(
          div0,
          "bp-drag",
          /*pointerDown*/
          ctx2[4]
        );
      }
      if (!current || dirty[0] & /*maxZoom, $imageDimensions, naturalWidth*/
      6145) {
        toggle_class(
          div0,
          "bp-canzoom",
          /*maxZoom*/
          ctx2[11] > 1 && /*$imageDimensions*/
          ctx2[0][0] < /*naturalWidth*/
          ctx2[12]
        );
      }
      if (dirty[0] & /*$imageDimensions, $zoomDragTranslate*/
      65 && style_transform !== (style_transform = `translate3d(${/*$imageDimensions*/
      ctx2[0][0] / -2 + /*$zoomDragTranslate*/
      ctx2[6][0]}px, ${/*$imageDimensions*/
      ctx2[0][1] / -2 + /*$zoomDragTranslate*/
      ctx2[6][1]}px, 0)`)) {
        set_style(div0, "transform", style_transform);
      }
      if (!current || dirty[0] & /*closingWhileZoomed*/
      32) {
        toggle_class(
          div1,
          "bp-close",
          /*closingWhileZoomed*/
          ctx2[5]
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block0);
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) detach(div1);
      if (if_block0) if_block0.d();
      if (if_block1) if_block1.d();
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$3($$self, $$props, $$invalidate) {
  let $zoomed;
  let $zoomDragTranslate;
  let $closing;
  let $imageDimensions;
  component_subscribe($$self, closing, ($$value) => $$invalidate(26, $closing = $$value));
  let { props } = $$props;
  let { smallScreen } = $$props;
  let { activeItem, opts, prev, next, zoomed, container } = props;
  component_subscribe($$self, zoomed, (value) => $$invalidate(25, $zoomed = value));
  let maxZoom = activeItem.maxZoom || opts.maxZoom || 10;
  let calculatedDimensions = props.calculateDimensions(activeItem);
  let sizes = calculatedDimensions[0];
  let loaded, showLoader;
  let pinchDetails;
  let bpImg;
  let prevDiff = 0;
  let pointerDown, hasDragged;
  let dragStartX, dragStartY;
  let dragStartTranslateX, dragStartTranslateY;
  let closingWhileZoomed;
  const naturalWidth = +activeItem.width;
  const dragPositions = [];
  const pointerCache = /* @__PURE__ */ new Map();
  const imageDimensions = tweened(calculatedDimensions, defaultTweenOptions(400));
  component_subscribe($$self, imageDimensions, (value) => $$invalidate(0, $imageDimensions = value));
  const zoomDragTranslate = tweened([0, 0], defaultTweenOptions(400));
  component_subscribe($$self, zoomDragTranslate, (value) => $$invalidate(6, $zoomDragTranslate = value));
  const boundTranslateValues = ([x2, y3], newDimensions = $imageDimensions) => {
    const maxTranslateX = (newDimensions[0] - container.w) / 2;
    const maxTranslateY = (newDimensions[1] - container.h) / 2;
    if (maxTranslateX < 0) {
      x2 = 0;
    } else if (x2 > maxTranslateX) {
      if (smallScreen) {
        x2 = pointerDown ? maxTranslateX + (x2 - maxTranslateX) / 10 : maxTranslateX;
        if (x2 > maxTranslateX + 20) {
          $$invalidate(4, pointerDown = prev());
        }
      } else {
        x2 = maxTranslateX;
      }
    } else if (x2 < -maxTranslateX) {
      if (smallScreen) {
        x2 = pointerDown ? -maxTranslateX - (-maxTranslateX - x2) / 10 : -maxTranslateX;
        if (x2 < -maxTranslateX - 20) {
          $$invalidate(4, pointerDown = next());
        }
      } else {
        x2 = -maxTranslateX;
      }
    }
    if (maxTranslateY < 0) {
      y3 = 0;
    } else if (y3 > maxTranslateY) {
      y3 = maxTranslateY;
    } else if (y3 < -maxTranslateY) {
      y3 = -maxTranslateY;
    }
    return [x2, y3];
  };
  function changeZoom(amt = maxZoom, e8) {
    if ($closing) {
      return;
    }
    const maxWidth = calculatedDimensions[0] * maxZoom;
    let newWidth = $imageDimensions[0] + $imageDimensions[0] * amt;
    let newHeight = $imageDimensions[1] + $imageDimensions[1] * amt;
    if (amt > 0) {
      if (newWidth > maxWidth) {
        newWidth = maxWidth;
        newHeight = calculatedDimensions[1] * maxZoom;
      }
      if (newWidth > naturalWidth) {
        newWidth = naturalWidth;
        newHeight = +activeItem.height;
      }
    } else if (newWidth < calculatedDimensions[0]) {
      imageDimensions.set(calculatedDimensions);
      return zoomDragTranslate.set([0, 0]);
    }
    let { x: x2, y: y3, width, height } = bpImg.getBoundingClientRect();
    const offsetX = e8 ? e8.clientX - x2 - width / 2 : 0;
    const offsetY = e8 ? e8.clientY - y3 - height / 2 : 0;
    x2 = -offsetX * (newWidth / width) + offsetX;
    y3 = -offsetY * (newHeight / height) + offsetY;
    const newDimensions = [newWidth, newHeight];
    imageDimensions.set(newDimensions).then(() => {
      $$invalidate(1, sizes = Math.round(Math.max(sizes, newWidth)));
    });
    zoomDragTranslate.set(boundTranslateValues([$zoomDragTranslate[0] + x2, $zoomDragTranslate[1] + y3], newDimensions));
  }
  Object.defineProperty(activeItem, "zoom", {
    configurable: true,
    get: () => $zoomed,
    set: (bool) => changeZoom(bool ? maxZoom : -maxZoom)
  });
  const onWheel = (e8) => {
    if (opts.inline && !$zoomed) {
      return;
    }
    e8.preventDefault();
    changeZoom(e8.deltaY / -300, e8);
  };
  const onPointerDown = (e8) => {
    if (e8.button !== 2) {
      e8.preventDefault();
      $$invalidate(4, pointerDown = true);
      pointerCache.set(e8.pointerId, e8);
      dragStartX = e8.clientX;
      dragStartY = e8.clientY;
      dragStartTranslateX = $zoomDragTranslate[0];
      dragStartTranslateY = $zoomDragTranslate[1];
    }
  };
  const onPointerMove = (e8) => {
    if (pointerCache.size > 1) {
      $$invalidate(4, pointerDown = false);
      return opts.noPinch?.(container.el) || handlePinch(e8);
    }
    if (!pointerDown) {
      return;
    }
    let x2 = e8.clientX;
    let y3 = e8.clientY;
    hasDragged = dragPositions.push({ x: x2, y: y3 }) > 2;
    x2 = x2 - dragStartX;
    y3 = y3 - dragStartY;
    if (!$zoomed) {
      if (y3 < -90) {
        $$invalidate(4, pointerDown = !opts.noClose && props.close());
      }
      if (Math.abs(y3) < 30) {
        if (x2 > 40) {
          $$invalidate(4, pointerDown = prev());
        }
        if (x2 < -40) {
          $$invalidate(4, pointerDown = next());
        }
      }
    }
    if ($zoomed && hasDragged && !$closing) {
      zoomDragTranslate.set(boundTranslateValues([dragStartTranslateX + x2, dragStartTranslateY + y3]), { duration: 0 });
    }
  };
  const handlePinch = (e8) => {
    const [p1, p22] = pointerCache.set(e8.pointerId, e8).values();
    const dx = p1.clientX - p22.clientX;
    const dy = p1.clientY - p22.clientY;
    const curDiff = Math.hypot(dx, dy);
    pinchDetails = pinchDetails || {
      clientX: (p1.clientX + p22.clientX) / 2,
      clientY: (p1.clientY + p22.clientY) / 2
    };
    changeZoom(((prevDiff || curDiff) - curDiff) / -35, pinchDetails);
    prevDiff = curDiff;
  };
  const removeEventFromCache = (e8) => pointerCache.delete(e8.pointerId);
  function onPointerUp(e8) {
    removeEventFromCache(e8);
    if (pinchDetails) {
      $$invalidate(4, pointerDown = prevDiff = 0);
      pinchDetails = pointerCache.size ? pinchDetails : null;
    }
    if (!pointerDown) {
      return;
    }
    $$invalidate(4, pointerDown = false);
    if (e8.target === this && !opts.noClose) {
      return props.close();
    }
    if (hasDragged) {
      const [posOne, posTwo, posThree] = dragPositions.slice(-3);
      const xDiff = posTwo.x - posThree.x;
      const yDiff = posTwo.y - posThree.y;
      if (Math.hypot(xDiff, yDiff) > 5) {
        zoomDragTranslate.set(boundTranslateValues([
          $zoomDragTranslate[0] - (posOne.x - posThree.x) * 5,
          $zoomDragTranslate[1] - (posOne.y - posThree.y) * 5
        ]));
      }
    } else if (!opts.onImageClick?.(container.el, activeItem)) {
      changeZoom($zoomed ? -maxZoom : maxZoom, e8);
    }
    hasDragged = false;
    dragPositions.length = 0;
  }
  const onMount = (node) => {
    bpImg = node;
    props.setResizeFunc(() => {
      $$invalidate(24, calculatedDimensions = props.calculateDimensions(activeItem));
      if (opts.inline || !smallScreen) {
        imageDimensions.set(calculatedDimensions);
        zoomDragTranslate.set([0, 0]);
      }
    });
    props.loadImage(activeItem).then(() => {
      $$invalidate(2, loaded = true);
      props.preloadNext();
    });
    setTimeout(
      () => {
        $$invalidate(3, showLoader = !loaded);
      },
      250
    );
  };
  const addSrc = (node) => {
    addAttributes(node, activeItem.attr);
    node.srcset = activeItem.img;
  };
  const error_handler = (error) => opts.onError?.(container, activeItem, error);
  $$self.$$set = ($$props2) => {
    if ("smallScreen" in $$props2) $$invalidate(23, smallScreen = $$props2.smallScreen);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*$imageDimensions, calculatedDimensions*/
    16777217) {
      zoomed.set($imageDimensions[0] - 10 > calculatedDimensions[0]);
    }
    if ($$self.$$.dirty[0] & /*$closing, $zoomed, calculatedDimensions*/
    117440512) {
      if ($closing && $zoomed && !opts.intro) {
        const closeTweenOpts = defaultTweenOptions(480);
        zoomDragTranslate.set([0, 0], closeTweenOpts);
        imageDimensions.set(calculatedDimensions, closeTweenOpts);
        $$invalidate(5, closingWhileZoomed = true);
      }
    }
  };
  return [
    $imageDimensions,
    sizes,
    loaded,
    showLoader,
    pointerDown,
    closingWhileZoomed,
    $zoomDragTranslate,
    activeItem,
    opts,
    zoomed,
    container,
    maxZoom,
    naturalWidth,
    imageDimensions,
    zoomDragTranslate,
    onWheel,
    onPointerDown,
    onPointerMove,
    removeEventFromCache,
    onPointerUp,
    onMount,
    addSrc,
    props,
    smallScreen,
    calculatedDimensions,
    $zoomed,
    $closing,
    error_handler
  ];
}
var Image2 = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$3, create_fragment$3, not_equal, { props: 22, smallScreen: 23 }, null, [-1, -1]);
  }
};
function create_fragment$2(ctx) {
  let div;
  let iframe;
  let loading;
  let current;
  let mounted;
  let dispose;
  loading = new Loading({
    props: {
      activeItem: (
        /*activeItem*/
        ctx[2]
      ),
      loaded: (
        /*loaded*/
        ctx[0]
      )
    }
  });
  return {
    c() {
      div = element("div");
      iframe = element("iframe");
      create_component(loading.$$.fragment);
      attr(iframe, "allow", "autoplay; fullscreen");
      attr(
        iframe,
        "title",
        /*activeItem*/
        ctx[2].title
      );
      attr(div, "class", "bp-if");
      set_style(
        div,
        "width",
        /*dimensions*/
        ctx[1][0] + "px"
      );
      set_style(
        div,
        "height",
        /*dimensions*/
        ctx[1][1] + "px"
      );
    },
    m(target, anchor) {
      insert(target, div, anchor);
      append(div, iframe);
      mount_component(loading, div, null);
      current = true;
      if (!mounted) {
        dispose = [
          action_destroyer(
            /*addSrc*/
            ctx[3].call(null, iframe)
          ),
          listen(
            iframe,
            "load",
            /*load_handler*/
            ctx[5]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const loading_changes = {};
      if (dirty & /*loaded*/
      1) loading_changes.loaded = /*loaded*/
      ctx2[0];
      loading.$set(loading_changes);
      if (!current || dirty & /*dimensions*/
      2) {
        set_style(
          div,
          "width",
          /*dimensions*/
          ctx2[1][0] + "px"
        );
      }
      if (!current || dirty & /*dimensions*/
      2) {
        set_style(
          div,
          "height",
          /*dimensions*/
          ctx2[1][1] + "px"
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(loading.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(loading.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      destroy_component(loading);
      mounted = false;
      run_all(dispose);
    }
  };
}
function instance$2($$self, $$props, $$invalidate) {
  let { props } = $$props;
  let loaded, dimensions;
  const { activeItem } = props;
  const setDimensions = () => $$invalidate(1, dimensions = props.calculateDimensions(activeItem));
  setDimensions();
  props.setResizeFunc(setDimensions);
  const addSrc = (node) => {
    addAttributes(node, activeItem.attr);
    node.src = activeItem.iframe;
  };
  const load_handler = () => $$invalidate(0, loaded = true);
  return [loaded, dimensions, activeItem, addSrc, props, load_handler];
}
var Iframe = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$2, create_fragment$2, not_equal, { props: 4 });
  }
};
function create_fragment$1(ctx) {
  let div;
  let loading;
  let current;
  let mounted;
  let dispose;
  loading = new Loading({
    props: {
      activeItem: (
        /*activeItem*/
        ctx[2]
      ),
      loaded: (
        /*loaded*/
        ctx[0]
      )
    }
  });
  return {
    c() {
      div = element("div");
      create_component(loading.$$.fragment);
      attr(div, "class", "bp-vid");
      set_style(
        div,
        "width",
        /*dimensions*/
        ctx[1][0] + "px"
      );
      set_style(
        div,
        "height",
        /*dimensions*/
        ctx[1][1] + "px"
      );
      set_style(div, "background-image", getThumbBackground(
        /*activeItem*/
        ctx[2]
      ));
    },
    m(target, anchor) {
      insert(target, div, anchor);
      mount_component(loading, div, null);
      current = true;
      if (!mounted) {
        dispose = action_destroyer(
          /*onMount*/
          ctx[3].call(null, div)
        );
        mounted = true;
      }
    },
    p(ctx2, [dirty]) {
      const loading_changes = {};
      if (dirty & /*loaded*/
      1) loading_changes.loaded = /*loaded*/
      ctx2[0];
      loading.$set(loading_changes);
      if (!current || dirty & /*dimensions*/
      2) {
        set_style(
          div,
          "width",
          /*dimensions*/
          ctx2[1][0] + "px"
        );
      }
      if (!current || dirty & /*dimensions*/
      2) {
        set_style(
          div,
          "height",
          /*dimensions*/
          ctx2[1][1] + "px"
        );
      }
    },
    i(local) {
      if (current) return;
      transition_in(loading.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(loading.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      destroy_component(loading);
      mounted = false;
      dispose();
    }
  };
}
function instance$1($$self, $$props, $$invalidate) {
  let { props } = $$props;
  let loaded, dimensions;
  const { activeItem, opts, container } = props;
  const setDimensions = () => $$invalidate(1, dimensions = props.calculateDimensions(activeItem));
  setDimensions();
  props.setResizeFunc(setDimensions);
  const onMount = (node) => {
    let mediaElement;
    const appendToVideo = (tag, arr) => {
      if (!Array.isArray(arr)) {
        arr = JSON.parse(arr);
      }
      for (const obj of arr) {
        if (!mediaElement) {
          mediaElement = document.createElement(obj.type?.includes("audio") ? "audio" : "video");
          addAttributes(mediaElement, {
            controls: true,
            autoplay: true,
            playsinline: true,
            tabindex: "0"
          });
          addAttributes(mediaElement, activeItem.attr);
        }
        const el = document.createElement(tag);
        addAttributes(el, obj);
        if (tag == "source") {
          el.onError = (error) => opts.onError?.(container, activeItem, error);
        }
        mediaElement.append(el);
      }
    };
    appendToVideo("source", activeItem.sources);
    appendToVideo("track", activeItem.tracks || []);
    mediaElement.oncanplay = () => $$invalidate(0, loaded = true);
    node.append(mediaElement);
  };
  return [loaded, dimensions, activeItem, onMount, props];
}
var Video = class extends SvelteComponent {
  constructor(options) {
    super();
    init(this, options, instance$1, create_fragment$1, not_equal, { props: 4 });
  }
};
function create_if_block(ctx) {
  let div2;
  let div0;
  let div0_outro;
  let previous_key = (
    /*activeItem*/
    ctx[6].i
  );
  let div1;
  let button;
  let div1_outro;
  let current;
  let mounted;
  let dispose;
  let key_block = create_key_block(ctx);
  let if_block = (
    /*items*/
    ctx[0].length > 1 && create_if_block_1(ctx)
  );
  return {
    c() {
      div2 = element("div");
      div0 = element("div");
      key_block.c();
      div1 = element("div");
      button = element("button");
      if (if_block) if_block.c();
      attr(button, "class", "bp-x");
      attr(button, "title", "Close");
      attr(button, "aria-label", "Close");
      attr(div1, "class", "bp-controls");
      attr(div2, "class", "bp-wrap");
      toggle_class(
        div2,
        "bp-zoomed",
        /*$zoomed*/
        ctx[10]
      );
      toggle_class(
        div2,
        "bp-inline",
        /*inline*/
        ctx[8]
      );
      toggle_class(
        div2,
        "bp-small",
        /*smallScreen*/
        ctx[7]
      );
      toggle_class(
        div2,
        "bp-noclose",
        /*opts*/
        ctx[5].noClose
      );
    },
    m(target, anchor) {
      insert(target, div2, anchor);
      append(div2, div0);
      key_block.m(div2, null);
      append(div2, div1);
      append(div1, button);
      if (if_block) if_block.m(div1, null);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            button,
            "click",
            /*close*/
            ctx[1]
          ),
          action_destroyer(
            /*containerActions*/
            ctx[14].call(null, div2)
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*activeItem*/
      64 && not_equal(previous_key, previous_key = /*activeItem*/
      ctx2[6].i)) {
        group_outros();
        transition_out(key_block, 1, 1, noop);
        check_outros();
        key_block = create_key_block(ctx2);
        key_block.c();
        transition_in(key_block, 1);
        key_block.m(div2, div1);
      } else {
        key_block.p(ctx2, dirty);
      }
      if (
        /*items*/
        ctx2[0].length > 1
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
        } else {
          if_block = create_if_block_1(ctx2);
          if_block.c();
          if_block.m(div1, null);
        }
      } else if (if_block) {
        if_block.d(1);
        if_block = null;
      }
      if (!current || dirty[0] & /*$zoomed*/
      1024) {
        toggle_class(
          div2,
          "bp-zoomed",
          /*$zoomed*/
          ctx2[10]
        );
      }
      if (!current || dirty[0] & /*inline*/
      256) {
        toggle_class(
          div2,
          "bp-inline",
          /*inline*/
          ctx2[8]
        );
      }
      if (!current || dirty[0] & /*smallScreen*/
      128) {
        toggle_class(
          div2,
          "bp-small",
          /*smallScreen*/
          ctx2[7]
        );
      }
      if (!current || dirty[0] & /*opts*/
      32) {
        toggle_class(
          div2,
          "bp-noclose",
          /*opts*/
          ctx2[5].noClose
        );
      }
    },
    i(local) {
      if (current) return;
      if (div0_outro) div0_outro.end(1);
      transition_in(key_block);
      if (div1_outro) div1_outro.end(1);
      current = true;
    },
    o(local) {
      if (local) {
        div0_outro = create_out_transition(div0, fly, { duration: 480 });
      }
      transition_out(key_block);
      if (local) {
        div1_outro = create_out_transition(div1, fly, {});
      }
      current = false;
    },
    d(detaching) {
      if (detaching) detach(div2);
      if (detaching && div0_outro) div0_outro.end();
      key_block.d(detaching);
      if (if_block) if_block.d();
      if (detaching && div1_outro) div1_outro.end();
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_else_block(ctx) {
  let div;
  let raw_value = (
    /*activeItem*/
    (ctx[6].html ?? /*activeItem*/
    ctx[6].element.outerHTML) + ""
  );
  return {
    c() {
      div = element("div");
      attr(div, "class", "bp-html");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      div.innerHTML = raw_value;
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*activeItem*/
      64 && raw_value !== (raw_value = /*activeItem*/
      (ctx2[6].html ?? /*activeItem*/
      ctx2[6].element.outerHTML) + "")) div.innerHTML = raw_value;
    },
    i: noop,
    o: noop,
    d(detaching) {
      if (detaching) detach(div);
    }
  };
}
function create_if_block_5(ctx) {
  let iframe;
  let current;
  iframe = new Iframe({
    props: { props: (
      /*getChildProps*/
      ctx[13]()
    ) }
  });
  return {
    c() {
      create_component(iframe.$$.fragment);
    },
    m(target, anchor) {
      mount_component(iframe, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(iframe.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(iframe.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(iframe, detaching);
    }
  };
}
function create_if_block_4(ctx) {
  let video;
  let current;
  video = new Video({
    props: { props: (
      /*getChildProps*/
      ctx[13]()
    ) }
  });
  return {
    c() {
      create_component(video.$$.fragment);
    },
    m(target, anchor) {
      mount_component(video, target, anchor);
      current = true;
    },
    p: noop,
    i(local) {
      if (current) return;
      transition_in(video.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(video.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(video, detaching);
    }
  };
}
function create_if_block_3(ctx) {
  let imageitem;
  let current;
  imageitem = new Image2({
    props: {
      props: (
        /*getChildProps*/
        ctx[13]()
      ),
      smallScreen: (
        /*smallScreen*/
        ctx[7]
      )
    }
  });
  return {
    c() {
      create_component(imageitem.$$.fragment);
    },
    m(target, anchor) {
      mount_component(imageitem, target, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      const imageitem_changes = {};
      if (dirty[0] & /*smallScreen*/
      128) imageitem_changes.smallScreen = /*smallScreen*/
      ctx2[7];
      imageitem.$set(imageitem_changes);
    },
    i(local) {
      if (current) return;
      transition_in(imageitem.$$.fragment, local);
      current = true;
    },
    o(local) {
      transition_out(imageitem.$$.fragment, local);
      current = false;
    },
    d(detaching) {
      destroy_component(imageitem, detaching);
    }
  };
}
function create_if_block_2(ctx) {
  let div;
  let raw_value = (
    /*activeItem*/
    ctx[6].caption + ""
  );
  let div_outro;
  let current;
  return {
    c() {
      div = element("div");
      attr(div, "class", "bp-cap");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      div.innerHTML = raw_value;
      current = true;
    },
    p(ctx2, dirty) {
      if ((!current || dirty[0] & /*activeItem*/
      64) && raw_value !== (raw_value = /*activeItem*/
      ctx2[6].caption + "")) div.innerHTML = raw_value;
    },
    i(local) {
      if (current) return;
      if (div_outro) div_outro.end(1);
      current = true;
    },
    o(local) {
      div_outro = create_out_transition(div, fly, { duration: 200 });
      current = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      if (detaching && div_outro) div_outro.end();
    }
  };
}
function create_key_block(ctx) {
  let div;
  let current_block_type_index;
  let if_block0;
  let div_intro;
  let div_outro;
  let if_block1_anchor;
  let current;
  let mounted;
  let dispose;
  const if_block_creators = [create_if_block_3, create_if_block_4, create_if_block_5, create_else_block];
  const if_blocks = [];
  function select_block_type(ctx2, dirty) {
    if (
      /*activeItem*/
      ctx2[6].img
    ) return 0;
    if (
      /*activeItem*/
      ctx2[6].sources
    ) return 1;
    if (
      /*activeItem*/
      ctx2[6].iframe
    ) return 2;
    return 3;
  }
  current_block_type_index = select_block_type(ctx);
  if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
  let if_block1 = (
    /*activeItem*/
    ctx[6].caption && create_if_block_2(ctx)
  );
  return {
    c() {
      div = element("div");
      if_block0.c();
      if (if_block1) if_block1.c();
      if_block1_anchor = empty();
      attr(div, "class", "bp-inner");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      if_blocks[current_block_type_index].m(div, null);
      if (if_block1) if_block1.m(target, anchor);
      insert(target, if_block1_anchor, anchor);
      current = true;
      if (!mounted) {
        dispose = [
          listen(
            div,
            "pointerdown",
            /*pointerdown_handler*/
            ctx[20]
          ),
          listen(
            div,
            "pointerup",
            /*pointerup_handler*/
            ctx[21]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      let previous_block_index = current_block_type_index;
      current_block_type_index = select_block_type(ctx2);
      if (current_block_type_index === previous_block_index) {
        if_blocks[current_block_type_index].p(ctx2, dirty);
      } else {
        group_outros();
        transition_out(if_blocks[previous_block_index], 1, 1, () => {
          if_blocks[previous_block_index] = null;
        });
        check_outros();
        if_block0 = if_blocks[current_block_type_index];
        if (!if_block0) {
          if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx2);
          if_block0.c();
        } else {
          if_block0.p(ctx2, dirty);
        }
        transition_in(if_block0, 1);
        if_block0.m(div, null);
      }
      if (
        /*activeItem*/
        ctx2[6].caption
      ) {
        if (if_block1) {
          if_block1.p(ctx2, dirty);
          if (dirty[0] & /*activeItem*/
          64) {
            transition_in(if_block1, 1);
          }
        } else {
          if_block1 = create_if_block_2(ctx2);
          if_block1.c();
          transition_in(if_block1, 1);
          if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
        }
      } else if (if_block1) {
        group_outros();
        transition_out(if_block1, 1, 1, () => {
          if_block1 = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block0);
      add_render_callback(() => {
        if (div_outro) div_outro.end(1);
        div_intro = create_in_transition(
          div,
          /*mediaTransition*/
          ctx[12],
          true
        );
        div_intro.start();
      });
      transition_in(if_block1);
      current = true;
    },
    o(local) {
      transition_out(if_block0);
      if (div_intro) div_intro.invalidate();
      div_outro = create_out_transition(
        div,
        /*mediaTransition*/
        ctx[12],
        false
      );
      transition_out(if_block1);
      current = false;
    },
    d(detaching) {
      if (detaching) detach(div);
      if_blocks[current_block_type_index].d();
      if (detaching && div_outro) div_outro.end();
      if (if_block1) if_block1.d(detaching);
      if (detaching) detach(if_block1_anchor);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_if_block_1(ctx) {
  let div;
  let raw_value = `${/*position*/
  ctx[4] + 1} / ${/*items*/
  ctx[0].length}`;
  let button0;
  let button1;
  let mounted;
  let dispose;
  return {
    c() {
      div = element("div");
      button0 = element("button");
      button1 = element("button");
      attr(div, "class", "bp-count");
      attr(button0, "class", "bp-prev");
      attr(button0, "title", "Previous");
      attr(button0, "aria-label", "Previous");
      attr(button1, "class", "bp-next");
      attr(button1, "title", "Next");
      attr(button1, "aria-label", "Next");
    },
    m(target, anchor) {
      insert(target, div, anchor);
      div.innerHTML = raw_value;
      insert(target, button0, anchor);
      insert(target, button1, anchor);
      if (!mounted) {
        dispose = [
          listen(
            button0,
            "click",
            /*prev*/
            ctx[2]
          ),
          listen(
            button1,
            "click",
            /*next*/
            ctx[3]
          )
        ];
        mounted = true;
      }
    },
    p(ctx2, dirty) {
      if (dirty[0] & /*position, items*/
      17 && raw_value !== (raw_value = `${/*position*/
      ctx2[4] + 1} / ${/*items*/
      ctx2[0].length}`)) div.innerHTML = raw_value;
    },
    d(detaching) {
      if (detaching) detach(div);
      if (detaching) detach(button0);
      if (detaching) detach(button1);
      mounted = false;
      run_all(dispose);
    }
  };
}
function create_fragment(ctx) {
  let if_block_anchor;
  let current;
  let if_block = (
    /*items*/
    ctx[0] && create_if_block(ctx)
  );
  return {
    c() {
      if (if_block) if_block.c();
      if_block_anchor = empty();
    },
    m(target, anchor) {
      if (if_block) if_block.m(target, anchor);
      insert(target, if_block_anchor, anchor);
      current = true;
    },
    p(ctx2, dirty) {
      if (
        /*items*/
        ctx2[0]
      ) {
        if (if_block) {
          if_block.p(ctx2, dirty);
          if (dirty[0] & /*items*/
          1) {
            transition_in(if_block, 1);
          }
        } else {
          if_block = create_if_block(ctx2);
          if_block.c();
          transition_in(if_block, 1);
          if_block.m(if_block_anchor.parentNode, if_block_anchor);
        }
      } else if (if_block) {
        group_outros();
        transition_out(if_block, 1, 1, () => {
          if_block = null;
        });
        check_outros();
      }
    },
    i(local) {
      if (current) return;
      transition_in(if_block);
      current = true;
    },
    o(local) {
      transition_out(if_block);
      current = false;
    },
    d(detaching) {
      if (if_block) if_block.d(detaching);
      if (detaching) detach(if_block_anchor);
    }
  };
}
function instance($$self, $$props, $$invalidate) {
  let $zoomed;
  let { items = void 0 } = $$props;
  let { target = void 0 } = $$props;
  const html = document.documentElement;
  let position;
  let opts;
  let isOpen;
  let focusTrigger;
  let smallScreen;
  let inline;
  let movement;
  let clickedEl;
  let activeItem;
  const activeItemIsHtml = () => !activeItem.img && !activeItem.sources && !activeItem.iframe;
  let resizeFunc;
  const setResizeFunc = (fn) => resizeFunc = fn;
  const container = {};
  const zoomed = writable(0);
  component_subscribe($$self, zoomed, (value) => $$invalidate(10, $zoomed = value));
  const open = (options) => {
    $$invalidate(5, opts = options);
    $$invalidate(8, inline = opts.inline);
    if (!inline && html.scrollHeight > html.clientHeight) {
      html.classList.add("bp-lock");
    }
    focusTrigger = document.activeElement;
    $$invalidate(19, container.w = target.offsetWidth, container);
    $$invalidate(
      19,
      container.h = target === document.body ? globalThis.innerHeight : target.clientHeight,
      container
    );
    $$invalidate(7, smallScreen = container.w < 769);
    $$invalidate(4, position = opts.position || 0);
    $$invalidate(0, items = []);
    for (let i6 = 0; i6 < (opts.items.length || 1); i6++) {
      let item = opts.items[i6] || opts.items;
      if ("dataset" in item) {
        items.push({ element: item, i: i6, ...item.dataset });
      } else {
        item.i = i6;
        items.push(item);
        item = item.element;
      }
      if (opts.el && opts.el === item) {
        $$invalidate(4, position = i6);
      }
    }
  };
  const close = () => {
    opts.onClose?.(container.el, activeItem);
    closing.set(true);
    $$invalidate(0, items = null);
    focusTrigger?.focus({ preventScroll: true });
  };
  const prev = () => setPosition(position - 1);
  const next = () => setPosition(position + 1);
  const setPosition = (index) => {
    movement = index - position;
    $$invalidate(4, position = getNextPosition(index));
  };
  const getNextPosition = (index) => (index + items.length) % items.length;
  const onKeydown = (e8) => {
    const { key, shiftKey } = e8;
    if (key === "Escape") {
      !opts.noClose && close();
    } else if (key === "ArrowRight") {
      next();
    } else if (key === "ArrowLeft") {
      prev();
    } else if (key === "Tab") {
      const { activeElement } = document;
      if (shiftKey || !activeElement.controls) {
        e8.preventDefault();
        const { focusWrap = container.el } = opts;
        const tabbable = [...focusWrap.querySelectorAll("*")].filter((node) => node.tabIndex >= 0);
        let index = tabbable.indexOf(activeElement);
        index += tabbable.length + (shiftKey ? -1 : 1);
        tabbable[index % tabbable.length].focus();
      }
    }
  };
  const calculateDimensions = ({ width = 1920, height = 1080 }) => {
    const { scale = 0.99 } = opts;
    const ratio = Math.min(1, container.w / width * scale, container.h / height * scale);
    return [Math.round(width * ratio), Math.round(height * ratio)];
  };
  const preloadNext = () => {
    if (items) {
      const nextItem = items[getNextPosition(position + 1)];
      const prevItem = items[getNextPosition(position - 1)];
      !nextItem.preload && loadImage(nextItem);
      !prevItem.preload && loadImage(prevItem);
    }
  };
  const loadImage = (item) => {
    if (item.img) {
      const image = document.createElement("img");
      image.sizes = opts.sizes || `${calculateDimensions(item)[0]}px`;
      image.srcset = item.img;
      item.preload = true;
      return image.decode().catch((error) => {
      });
    }
  };
  const mediaTransition = (node, isEntering) => {
    if (!isOpen || !items) {
      $$invalidate(18, isOpen = isEntering);
      return opts.intro ? fly(node, { y: isEntering ? 10 : -10 }) : scaleIn(node);
    }
    return fly(node, {
      x: (movement > 0 ? 20 : -20) * (isEntering ? 1 : -1),
      duration: 250
    });
  };
  const scaleIn = (node) => {
    let dimensions;
    if (activeItemIsHtml()) {
      const bpItem = node.firstChild.firstChild;
      dimensions = [bpItem.clientWidth, bpItem.clientHeight];
    } else {
      dimensions = calculateDimensions(activeItem);
    }
    const rect = (activeItem.element || focusTrigger).getBoundingClientRect();
    const leftOffset = rect.left - (container.w - rect.width) / 2;
    const centerTop = rect.top - (container.h - rect.height) / 2;
    const scaleWidth = rect.width / dimensions[0];
    const scaleHeight = rect.height / dimensions[1];
    return {
      duration: 480,
      easing: cubicOut,
      css: (t4, u3) => {
        return `transform:translate3d(${leftOffset * u3}px, ${centerTop * u3}px, 0) scale3d(${scaleWidth + t4 * (1 - scaleWidth)}, ${scaleHeight + t4 * (1 - scaleHeight)}, 1)`;
      }
    };
  };
  const getChildProps = () => ({
    activeItem,
    calculateDimensions,
    loadImage,
    preloadNext,
    opts,
    prev,
    next,
    close,
    setResizeFunc,
    zoomed,
    container
  });
  const containerActions = (node) => {
    $$invalidate(19, container.el = node, container);
    let roActive;
    opts.onOpen?.(container.el, activeItem);
    if (!inline) {
      globalThis.addEventListener("keydown", onKeydown);
    }
    const ro = new ResizeObserver((entries) => {
      if (roActive) {
        $$invalidate(19, container.w = entries[0].contentRect.width, container);
        $$invalidate(19, container.h = entries[0].contentRect.height, container);
        $$invalidate(7, smallScreen = container.w < 769);
        if (!activeItemIsHtml()) {
          resizeFunc?.();
        }
        opts.onResize?.(container.el, activeItem);
      }
      roActive = true;
    });
    ro.observe(node);
    return {
      destroy() {
        ro.disconnect();
        globalThis.removeEventListener("keydown", onKeydown);
        closing.set(false);
        html.classList.remove("bp-lock");
        opts.onClosed?.();
      }
    };
  };
  const pointerdown_handler = (e8) => $$invalidate(9, clickedEl = e8.target);
  const pointerup_handler = function(e8) {
    if (e8.button !== 2 && e8.target === this && clickedEl === this) {
      !opts.noClose && close();
    }
  };
  $$self.$$set = ($$props2) => {
    if ("items" in $$props2) $$invalidate(0, items = $$props2.items);
    if ("target" in $$props2) $$invalidate(15, target = $$props2.target);
  };
  $$self.$$.update = () => {
    if ($$self.$$.dirty[0] & /*items, position, isOpen, opts, container, activeItem*/
    786545) {
      if (items) {
        $$invalidate(6, activeItem = items[position]);
        if (isOpen) {
          opts.onUpdate?.(container.el, activeItem);
        }
      }
    }
  };
  return [
    items,
    close,
    prev,
    next,
    position,
    opts,
    activeItem,
    smallScreen,
    inline,
    clickedEl,
    $zoomed,
    zoomed,
    mediaTransition,
    getChildProps,
    containerActions,
    target,
    open,
    setPosition,
    isOpen,
    container,
    pointerdown_handler,
    pointerup_handler
  ];
}
var Bigger_picture = class extends SvelteComponent {
  constructor(options) {
    super();
    init(
      this,
      options,
      instance,
      create_fragment,
      not_equal,
      {
        items: 0,
        target: 15,
        open: 16,
        close: 1,
        prev: 2,
        next: 3,
        setPosition: 17
      },
      null,
      [-1, -1]
    );
  }
  get items() {
    return this.$$.ctx[0];
  }
  get target() {
    return this.$$.ctx[15];
  }
  get open() {
    return this.$$.ctx[16];
  }
  get close() {
    return this.$$.ctx[1];
  }
  get prev() {
    return this.$$.ctx[2];
  }
  get next() {
    return this.$$.ctx[3];
  }
  get setPosition() {
    return this.$$.ctx[17];
  }
};
function biggerPicture(options) {
  return new Bigger_picture({
    ...options,
    props: options
  });
}

// src_web/gallery/gallery.ts
var import_macy = __toESM(require_macy());
var formattedTitle = (m2) => {
  return `${m2.nodeTitle} - (#${m2.nodeId})`;
};
var JKImage = class {
  constructor(m2, showInfo, showOpacityOverlay, clickedCallback) {
    this.m = m2;
    this.clickedCallback = clickedCallback;
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("jk-img-wrapper");
    if (showOpacityOverlay) {
      this.opacityOverlay = document.createElement("div");
      this.opacityOverlay.innerHTML = `<sl-icon src="${eye_fill_default}"></sl-icon>`;
      this.opacityOverlay.classList.add("jk-img-hover");
      this.wrapper.append(this.opacityOverlay);
    }
    this.spinner = document.createElement("div");
    this.spinner.innerHTML = `<div class="jk-spinner-wrap"><sl-spinner style="font-size: 3rem; --track-width: 3px; --track-color: var(--border-color); --indicator-color: var(--p-progressspinner-color-2)"></sl-spinner></div>`;
    this.wrapper.append(this.spinner);
    if (showInfo) {
      this.info = document.createElement("div");
      this.info.textContent = `${m2.nodeTitle} - (#${m2.nodeId})`;
      this.info.innerHTML = `
                <div class="jk-img-info-title">
                    <sl-badge variant="neutral">
                            ${m2.nodeTitle} - (#${m2.nodeId})
                    </sl-badge>
                </div>
                  <div class="jk-img-info-time">
                    <sl-badge variant="success"> 
                        ${(m2.execTimeMs / 1e3).toFixed(2)}s
                    </sl-badge>
                </div>
            `;
      this.info.classList.add("jk-img-info-wrapper");
      this.wrapper.append(this.info);
    }
  }
  get data() {
    return this.m;
  }
  loadImage(url) {
    return new Promise((resolve, reject) => {
      const loadMe = new Image();
      loadMe.onload = (ev) => {
        return resolve(loadMe);
      };
      loadMe.onerror = reject;
      loadMe.src = url;
    });
  }
  async init() {
    this.img = await this.loadImage(this.m.href);
    this.img.src = this.m.href;
    this.img.onclick = (ev) => {
      this.clickedCallback?.(this.m);
    };
    this.img.classList.add("jk-img");
    this.wrapper.appendChild(this.img);
    this.wrapper.removeChild(this.spinner);
    return this;
  }
  getEl() {
    return this.wrapper;
  }
};
var JKRightPanelImage = class {
  constructor(data, onOpenLightboxRequest) {
    this.data = data;
    this.onOpenLightboxRequest = onOpenLightboxRequest;
    this.container = document.createElement("div");
    this.container.classList.add("jk-rightpanel-container");
    this.title = document.createElement("div");
    this.title.classList.add("jk-rightpanel-title");
    this.infoDialog = document.createElement("dialog");
    this.infoDialog.classList.add("jk-info-dialog");
    this.dialogCloseBtn = document.createElement("button");
    this.dialogCloseBtn.innerText = "X";
    this.dialogCloseBtn.classList.add("jk-dialog-close-btn");
    this.dialogCloseBtn.onclick = () => {
      if (this.infoDialog) {
        this.promptSearch.value = "";
        this.infoDialog.close();
      }
    };
    this.infoDialog.innerHTML = `
            <div class="info-dialog-header">
                <input autofocus id="prompt-search" type="text" placeholder="search"></input>
                <div class="comfyui-menu"> 
                      <button class="comfyui-button" id="info-expand-all"> Expand All </button>
                    <button class="comfyui-button" id="info-collapse-all"> Collapse All </button>
                </div>          
            </div>
        `;
    this.infoDialog.appendChild(this.dialogCloseBtn);
    this.buttonGroup = document.createElement("div");
    this.buttonGroup.classList.add("comfyui-button-group");
    this.info = document.createElement("div");
    this.info.classList.add("jk-info-dialog-inner");
    this.infoDialog.appendChild(this.info);
  }
  getEl() {
    return this.container;
  }
  showInfoModal() {
    this.infoDialog.showModal();
    this.promptSearch = document.getElementById("prompt-search");
    this.expandAllBtn = document.getElementById("info-expand-all");
    this.expandAllBtn.addEventListener("click", (ev) => {
      this.promptViewer?.expandAll();
      this.promptViewer?.resetFilter();
      this.currentSearch = void 0;
    });
    this.collapseAllBtn = document.getElementById("info-collapse-all");
    this.collapseAllBtn?.addEventListener("click", (ev) => {
      this.promptViewer?.collapseAll();
      this.promptViewer?.resetFilter();
      this.currentSearch = void 0;
    });
    this.promptSearch.addEventListener("input", (ev) => {
      this.currentSearch = this.promptViewer?.search(ev?.target?.value ?? "");
    });
    this.promptSearch.addEventListener("keyup", async (e8) => {
      if (this.currentSearch && (e8.keyCode === 13 || e8.key.toLowerCase() === "enter")) {
        await this.currentSearch.next();
        setTimeout(() => {
          this.promptSearch?.focus();
        }, 1);
      }
    });
  }
  async tryLoadMetaData() {
    try {
      const blob = await fetch(this.data.href).then((r8) => r8.blob());
      const metadata = await window.comfyAPI.pnginfo.getPngMetadata(blob);
      this.promptMetadata = JSON.parse(metadata?.prompt);
      const seed = findKeyValueRecursive(this.promptMetadata, "seed");
      if (typeof seed?.seed === "number") {
        this.seed = seed.seed;
        document.getElementById("seed").innerText = `Seed: ${this.seed}`;
      }
      this.promptViewer = document.createElement("json-viewer");
      this.promptViewer.data = { prompt: this.promptMetadata };
      this.info.appendChild(this.promptViewer);
      const ComfyButton = (await import("../../../scripts/ui/components/button.js")).ComfyButton;
      this.viewPrompInfoButton = new ComfyButton({
        icon: "information",
        action: () => {
          this.showInfoModal();
        },
        tooltip: "View Prompt Info",
        content: "Prompt Info"
      });
      this.viewPrompInfoButton.element.classList.add("jk-view-prompt-info-btn");
      document.getElementById("right-panel-btn-group")?.appendChild(this.viewPrompInfoButton.element);
    } catch (err) {
      console.error("failed to get metadata", err);
      try {
        this.title.removeChild(document.getElementById("right-panel-btn-group"));
        this.title.removeChild(document.getElementById("seed"));
      } catch (e8) {
      }
    }
    window.dispatchEvent(new Event("resize"));
  }
  resizeHack() {
    if (!this.img || !this.title) return;
    this.img.getEl().style.height = `calc(100% - ${this.title.clientHeight}px)`;
  }
  async init() {
    this.container.appendChild(this.title);
    this.title.innerHTML = `
        <div>
            ${this.data.nodeTitle} - (#${this.data.nodeId})
        </div>
         <div>
            filename: ${this.data.fileName}
        </div>
        <div id="seed"> </div>
        <div id="right-panel-btn-group" class="comfyui-menu">
            
        </div>
        `;
    this.img = await new JKImage(this.data, false, true).init();
    this.container.appendChild(this.img.getEl());
    this.img.opacityOverlay?.addEventListener("click", (ev) => {
      this.onOpenLightboxRequest(this.img, this.data);
    });
    this.container.appendChild(this.infoDialog);
    this.tryLoadMetaData();
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 1);
    return this;
  }
};
var JKImageGallery = class extends EventTarget {
  constructor(container, feedBarContainer) {
    super();
    this.container = container;
    this.feedBarContainer = feedBarContainer;
    this.initialized = false;
    this.images = [];
    // map of formatted node title => all image outputs we have from that node
    this.imageMap = /* @__PURE__ */ new Map();
    this.currentMode = "feed" /* feed */;
    this.handleImageClicked = (data) => {
      this.selectImage(data);
    };
    this.clearFeed = (ev) => {
      if (confirm("are you sure you want to clear the feed? This cant be undone!")) {
        this.leftPanel.innerHTML = ``;
        this.images = [];
        this.rightPanel.innerHTML = ``;
        this.selectedImage = void 0;
        this.imageMap = /* @__PURE__ */ new Map();
        this.dispatchEvent(new Event("feed-clear" /* feed-clear */));
      }
    };
    this.handleModeChange = async (newMode) => {
      if (newMode === "grid" /* grid */) {
        this.feedPanel.style.display = "none";
        this.gridPanel.style.display = "flex";
        this.gridPanel.innerHTML = ``;
        this.images.forEach((i6) => {
          const newImg = document.createElement("img");
          newImg.src = i6.data.href;
          this.gridPanel.appendChild(newImg);
        });
        this.macy?.reInit();
      } else {
        this.feedPanel.style.display = "grid";
        this.gridPanel.style.display = "none";
        this._macy?.remove();
      }
      this.currentMode = newMode;
    };
    this.handleOpenLightbox = (selectedImg, data) => {
      let openAtIndex = 0;
      const items = [];
      let imageIndex = 0;
      this.images.forEach((x2) => {
        const isChecked = this.FeedBar.checkedItems.get(formattedTitle(x2.data));
        if (isChecked) {
          if (x2.data.href === selectedImg.data.href) {
            openAtIndex = imageIndex;
          }
          items.push({
            img: x2.data.href,
            thumb: x2.data.href,
            height: x2.img.naturalHeight,
            width: x2.img.naturalWidth,
            caption: x2.data.fileName
          });
          imageIndex++;
        }
      });
      this.lightbox.open({
        items,
        intro: "fadeup",
        position: openAtIndex,
        onUpdate: (container, activeItem) => {
          const itemData = this.images[activeItem?.["i"]]?.data;
          if (itemData) {
            this.selectImage(itemData);
          }
        }
      });
    };
    this.updateImageVisibility = () => {
      this.images.forEach((i6) => {
        const isChecked = this.FeedBar.checkedItems.get(formattedTitle(i6.data));
        i6.getEl().style.display = isChecked ? "flex" : "none";
      });
    };
    this.container.innerHTML = `
            <sl-split-panel id="jk-feed-panel" position="15" style="--max: 35%; --min:10%;">
                <div
                    id="jk-gallery-left-panel"
                    slot="start"
                >
                </div>
                <div
                    slot="end"
                    id="jk-gallery-right-panel"
                >
                </div>
            </sl-split-panel>
            <div id="jk-grid-panel"> 
                <div id="jk-grid-inner"> </div>
            </div>
        `;
    this.FeedBar = new JKFeedBar(this.feedBarContainer);
    this.feedPanel = document.getElementById("jk-feed-panel");
    this.gridPanel = document.getElementById("jk-grid-inner");
    window.addEventListener("resize", () => {
      this.selectedImage?.resizeHack();
    });
    this.lightbox = biggerPicture({
      target: document.body
    });
  }
  get macy() {
    if (!this._macy) {
      this._macy = new import_macy.default({
        container: "#jk-grid-inner",
        trueOrder: true,
        margin: 24,
        columns: 6,
        breakAt: {
          1200: 5,
          940: 3,
          520: 2,
          400: 1
        }
      });
    }
    return this._macy;
  }
  get leftPanel() {
    return document.getElementById("jk-gallery-left-panel");
  }
  get rightPanel() {
    return document.getElementById("jk-gallery-right-panel");
  }
  async init(mode) {
    if (!this.initialized) {
      this.initialized = true;
      await this.FeedBar.init();
      this.FeedBar.addEventListener("feed-clear" /* feed-clear */, this.clearFeed);
      this.FeedBar.addEventListener("check-change" /* check-change */, this.updateImageVisibility);
      this.FeedBar.addEventListener("feed-mode" /* feed-mode */, (ev) => this.handleModeChange(ev.detail));
    }
    if (mode !== this.currentMode) {
      this.handleModeChange(mode);
    }
  }
  async selectImage(data) {
    this.selectedImage = await new JKRightPanelImage(data, this.handleOpenLightbox).init();
    this.rightPanel.replaceChildren(this.selectedImage.getEl());
  }
  async addImage(data, updateFeedBar) {
    const nodeTitle = formattedTitle(data);
    let isNewNode = false;
    if (!this.imageMap.has(nodeTitle)) {
      this.imageMap.set(nodeTitle, []);
      isNewNode = true;
    }
    this.imageMap.get(nodeTitle).unshift(data);
    const img = await new JKImage(data, true, false, this.handleImageClicked).init();
    this.images.unshift(img);
    this.leftPanel.prepend(img.getEl());
    if (updateFeedBar && isNewNode) {
      this.FeedBar.addCheckboxOptionIfNeeded(nodeTitle, true);
    }
  }
  async addImages(imgs) {
    if (!imgs) return;
    for (const i6 of imgs) {
      await this.addImage(i6, false);
    }
    if (!this.selectedImage && imgs.length) {
      this.selectImage(imgs[0]);
    }
    this.FeedBar.updateCheckboxOptions([...this.imageMap.keys()], true);
  }
};
export {
  JKImageGallery
};
/*! Bundled license information:

@lit/reactive-element/css-tag.js:
  (**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/reactive-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/lit-html.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-element/lit-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/is-server.js:
  (**
   * @license
   * Copyright 2022 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/custom-element.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/property.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/state.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/event-options.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/base.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-all.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-async.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-elements.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

@lit/reactive-element/decorators/query-assigned-nodes.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/class-map.js:
  (**
   * @license
   * Copyright 2018 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/map.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/when.js:
  (**
   * @license
   * Copyright 2021 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
