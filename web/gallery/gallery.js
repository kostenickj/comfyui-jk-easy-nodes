var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// src_web/gallery/feedBar.ts
var JKFeedBar = class {
  constructor(el) {
    this.el = el;
    this.el.classList.add("comfyui-menu", "flex", "items-center");
    this.buttonGroup = document.createElement("div");
    this.el.append(this.buttonGroup);
    this.buttonGroup.classList.add("comfyui-button-group");
  }
  async init() {
    const ComfyButton = (await import("../../../scripts/ui/components/button.js")).ComfyButton;
    const test = new ComfyButton({
      icon: "image-multiple",
      action: () => {
        console.log("gldkdkd");
      },
      tooltip: "Toggle Image Window",
      content: "test button"
    });
    this.buttonGroup.append(test.element);
    console.log(test);
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

// node_modules/.pnpm/@alenaksu+json-viewer@2.1.2/node_modules/@alenaksu/json-viewer/dist/chunk-6HJCMUMX.js
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i6 = decorators.length - 1, decorator; i6 >= 0; i6--)
    if (decorator = decorators[i6])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
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
      if (isPrimitive(node) && String(node).match(criteria)) {
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

// node_modules/.pnpm/@alenaksu+json-viewer@2.1.2/node_modules/@alenaksu/json-viewer/dist/json-viewer.js
customElements.define("json-viewer", JsonViewer);

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/assets/icons/eye-fill.svg
var eye_fill_default = "../eye-fill-RBTRTZO3.svg";

// src_web/gallery/gallery.ts
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
  constructor(m2) {
    this.m = m2;
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
        this.infoDialog.close();
      }
    };
    this.infoDialog.innerHTML = `
            <div class="info-dialog-header">
                <input id="prompt-search" type="text" placeholder="search"></input>
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
    this.promptSearch.addEventListener("input", (ev) => {
      this.currentSearch = this.promptViewer?.search(ev?.target?.value ?? "");
    });
    this.promptSearch.addEventListener("keyup", (e8) => {
      if (this.currentSearch && (e8.keyCode === 13 || e8.key.toLowerCase() === "enter")) {
        this.currentSearch.next();
      }
    });
  }
  async tryLoadMetaData() {
    try {
      const blob = await fetch(this.m.href).then((r8) => r8.blob());
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
        icon: "info",
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
    }
  }
  async init() {
    this.container.appendChild(this.title);
    this.title.innerHTML = `
        <div>
            ${this.m.nodeTitle} - (#${this.m.nodeId})
        </div>
         <div>
            filename: ${this.m.fileName}
        </div>
        <div id="seed"> </div>
        <div id="right-panel-btn-group" class="comfyui-menu">
            
        </div>
        `;
    this.img = await new JKImage(this.m, false, true).init();
    this.container.appendChild(this.img.getEl());
    this.container.appendChild(this.infoDialog);
    this.tryLoadMetaData();
    return this;
  }
};
var JKImageGallery = class {
  constructor(container, feedBarContainer) {
    this.container = container;
    this.feedBarContainer = feedBarContainer;
    this.initialized = false;
    this.images = [];
    // node title and # => image
    this.imageMap = /* @__PURE__ */ new Map();
    this.handleImageClicked = (data) => {
      this.selectImage(data);
    };
    this.container.innerHTML = `
            <sl-split-panel position="15" style="--max: 35%; --min:10%;">
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
        `;
    this.FeedBar = new JKFeedBar(this.feedBarContainer);
  }
  //TODO, add ability to toggle which ouputs to view images from based on node title/#
  // add clear button
  // implement right sigght of gallery, on first load if no image there load the first image we get
  // on click go full screen
  get leftPanel() {
    return document.getElementById("jk-gallery-left-panel");
  }
  get rightPanel() {
    return document.getElementById("jk-gallery-right-panel");
  }
  async init() {
    if (!this.initialized) {
      this.initialized = true;
      await this.FeedBar.init();
    }
  }
  async selectImage(data) {
    this.selectedImage = await new JKRightPanelImage(data).init();
    this.rightPanel.replaceChildren(this.selectedImage.getEl());
  }
  async addImage(data) {
    const nodeTitle = `${data.nodeTitle} - (#${data.nodeId})`;
    if (!this.imageMap.has(nodeTitle)) this.imageMap.set(nodeTitle, []);
    this.imageMap.get(nodeTitle).unshift(data);
    const img = await new JKImage(data, true, false, this.handleImageClicked).init();
    this.images.unshift(img);
    this.leftPanel.prepend(img.getEl());
  }
  async addImages(imgs) {
    if (!imgs) return;
    for (const i6 of imgs) {
      await this.addImage(i6);
    }
    if (!this.selectedImage && imgs.length) {
      this.selectImage(imgs[0]);
    }
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
