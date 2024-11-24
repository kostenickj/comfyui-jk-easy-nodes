var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

// node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/util.js
function isPromise(obj) {
  return obj && typeof obj.then === "function";
}
function sleep(time, resolveWith) {
  if (!time) time = 0;
  return new Promise(function(res) {
    return setTimeout(function() {
      return res(resolveWith);
    }, time);
  });
}
function randomInt(min2, max2) {
  return Math.floor(Math.random() * (max2 - min2 + 1) + min2);
}
function randomToken() {
  return Math.random().toString(36).substring(2);
}
function microSeconds() {
  var ret = Date.now() * 1e3;
  if (ret <= lastMs) {
    ret = lastMs + 1;
  }
  lastMs = ret;
  return ret;
}
var PROMISE_RESOLVED_FALSE, PROMISE_RESOLVED_TRUE, PROMISE_RESOLVED_VOID, lastMs;
var init_util = __esm({
  "node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/util.js"() {
    PROMISE_RESOLVED_FALSE = Promise.resolve(false);
    PROMISE_RESOLVED_TRUE = Promise.resolve(true);
    PROMISE_RESOLVED_VOID = Promise.resolve();
    lastMs = 0;
  }
});

// node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/methods/native.js
function create(channelName) {
  var state = {
    time: microSeconds(),
    messagesCallback: null,
    bc: new BroadcastChannel(channelName),
    subFns: []
    // subscriberFunctions
  };
  state.bc.onmessage = function(msgEvent) {
    if (state.messagesCallback) {
      state.messagesCallback(msgEvent.data);
    }
  };
  return state;
}
function close(channelState) {
  channelState.bc.close();
  channelState.subFns = [];
}
function postMessage(channelState, messageJson) {
  try {
    channelState.bc.postMessage(messageJson, false);
    return PROMISE_RESOLVED_VOID;
  } catch (err) {
    return Promise.reject(err);
  }
}
function onMessage(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed() {
  if (typeof globalThis !== "undefined" && globalThis.Deno && globalThis.Deno.args) {
    return true;
  }
  if ((typeof window !== "undefined" || typeof self !== "undefined") && typeof BroadcastChannel === "function") {
    if (BroadcastChannel._pubkey) {
      throw new Error("BroadcastChannel: Do not overwrite window.BroadcastChannel with this module, this is not a polyfill");
    }
    return true;
  } else {
    return false;
  }
}
function averageResponseTime() {
  return 150;
}
var microSeconds2, type, NativeMethod;
var init_native = __esm({
  "node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/methods/native.js"() {
    init_util();
    microSeconds2 = microSeconds;
    type = "native";
    NativeMethod = {
      create,
      close,
      onMessage,
      postMessage,
      canBeUsed,
      type,
      averageResponseTime,
      microSeconds: microSeconds2
    };
  }
});

// node_modules/.pnpm/oblivious-set@1.4.0/node_modules/oblivious-set/dist/esm/src/index.js
function removeTooOldValues(obliviousSet) {
  const olderThen = now() - obliviousSet.ttl;
  const iterator = obliviousSet.map[Symbol.iterator]();
  while (true) {
    const next = iterator.next().value;
    if (!next) {
      return;
    }
    const value = next[0];
    const time = next[1];
    if (time < olderThen) {
      obliviousSet.map.delete(value);
    } else {
      return;
    }
  }
}
function now() {
  return Date.now();
}
var ObliviousSet;
var init_src = __esm({
  "node_modules/.pnpm/oblivious-set@1.4.0/node_modules/oblivious-set/dist/esm/src/index.js"() {
    ObliviousSet = class {
      constructor(ttl) {
        __publicField(this, "ttl");
        __publicField(this, "map", /* @__PURE__ */ new Map());
        /**
         * Creating calls to setTimeout() is expensive,
         * so we only do that if there is not timeout already open.
         */
        __publicField(this, "_to", false);
        this.ttl = ttl;
      }
      has(value) {
        return this.map.has(value);
      }
      add(value) {
        this.map.set(value, now());
        if (!this._to) {
          this._to = true;
          setTimeout(() => {
            this._to = false;
            removeTooOldValues(this);
          }, 0);
        }
      }
      clear() {
        this.map.clear();
      }
    };
  }
});

// node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/options.js
function fillOptionsWithDefaults() {
  var originalOptions = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var options = JSON.parse(JSON.stringify(originalOptions));
  if (typeof options.webWorkerSupport === "undefined") options.webWorkerSupport = true;
  if (!options.idb) options.idb = {};
  if (!options.idb.ttl) options.idb.ttl = 1e3 * 45;
  if (!options.idb.fallbackInterval) options.idb.fallbackInterval = 150;
  if (originalOptions.idb && typeof originalOptions.idb.onclose === "function") options.idb.onclose = originalOptions.idb.onclose;
  if (!options.localstorage) options.localstorage = {};
  if (!options.localstorage.removeTimeout) options.localstorage.removeTimeout = 1e3 * 60;
  if (originalOptions.methods) options.methods = originalOptions.methods;
  if (!options.node) options.node = {};
  if (!options.node.ttl) options.node.ttl = 1e3 * 60 * 2;
  if (!options.node.maxParallelWrites) options.node.maxParallelWrites = 2048;
  if (typeof options.node.useFastPath === "undefined") options.node.useFastPath = true;
  return options;
}
var init_options = __esm({
  "node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/options.js"() {
  }
});

// node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/methods/indexed-db.js
function getIdb() {
  if (typeof indexedDB !== "undefined") return indexedDB;
  if (typeof window !== "undefined") {
    if (typeof window.mozIndexedDB !== "undefined") return window.mozIndexedDB;
    if (typeof window.webkitIndexedDB !== "undefined") return window.webkitIndexedDB;
    if (typeof window.msIndexedDB !== "undefined") return window.msIndexedDB;
  }
  return false;
}
function commitIndexedDBTransaction(tx) {
  if (tx.commit) {
    tx.commit();
  }
}
function createDatabase(channelName) {
  var IndexedDB = getIdb();
  var dbName = DB_PREFIX + channelName;
  var openRequest = IndexedDB.open(dbName);
  openRequest.onupgradeneeded = function(ev) {
    var db = ev.target.result;
    db.createObjectStore(OBJECT_STORE_ID, {
      keyPath: "id",
      autoIncrement: true
    });
  };
  return new Promise(function(res, rej) {
    openRequest.onerror = function(ev) {
      return rej(ev);
    };
    openRequest.onsuccess = function() {
      res(openRequest.result);
    };
  });
}
function writeMessage(db, readerUuid, messageJson) {
  var time = Date.now();
  var writeObject = {
    uuid: readerUuid,
    time,
    data: messageJson
  };
  var tx = db.transaction([OBJECT_STORE_ID], "readwrite", TRANSACTION_SETTINGS);
  return new Promise(function(res, rej) {
    tx.oncomplete = function() {
      return res();
    };
    tx.onerror = function(ev) {
      return rej(ev);
    };
    var objectStore = tx.objectStore(OBJECT_STORE_ID);
    objectStore.add(writeObject);
    commitIndexedDBTransaction(tx);
  });
}
function getMessagesHigherThan(db, lastCursorId) {
  var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  var keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
  if (objectStore.getAll) {
    var getAllRequest = objectStore.getAll(keyRangeValue);
    return new Promise(function(res, rej) {
      getAllRequest.onerror = function(err) {
        return rej(err);
      };
      getAllRequest.onsuccess = function(e10) {
        res(e10.target.result);
      };
    });
  }
  function openCursor() {
    try {
      keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
      return objectStore.openCursor(keyRangeValue);
    } catch (e10) {
      return objectStore.openCursor();
    }
  }
  return new Promise(function(res, rej) {
    var openCursorRequest = openCursor();
    openCursorRequest.onerror = function(err) {
      return rej(err);
    };
    openCursorRequest.onsuccess = function(ev) {
      var cursor = ev.target.result;
      if (cursor) {
        if (cursor.value.id < lastCursorId + 1) {
          cursor["continue"](lastCursorId + 1);
        } else {
          ret.push(cursor.value);
          cursor["continue"]();
        }
      } else {
        commitIndexedDBTransaction(tx);
        res(ret);
      }
    };
  });
}
function removeMessagesById(channelState, ids) {
  if (channelState.closed) {
    return Promise.resolve([]);
  }
  var tx = channelState.db.transaction(OBJECT_STORE_ID, "readwrite", TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  return Promise.all(ids.map(function(id) {
    var deleteRequest = objectStore["delete"](id);
    return new Promise(function(res) {
      deleteRequest.onsuccess = function() {
        return res();
      };
    });
  }));
}
function getOldMessages(db, ttl) {
  var olderThen = Date.now() - ttl;
  var tx = db.transaction(OBJECT_STORE_ID, "readonly", TRANSACTION_SETTINGS);
  var objectStore = tx.objectStore(OBJECT_STORE_ID);
  var ret = [];
  return new Promise(function(res) {
    objectStore.openCursor().onsuccess = function(ev) {
      var cursor = ev.target.result;
      if (cursor) {
        var msgObk = cursor.value;
        if (msgObk.time < olderThen) {
          ret.push(msgObk);
          cursor["continue"]();
        } else {
          commitIndexedDBTransaction(tx);
          res(ret);
        }
      } else {
        res(ret);
      }
    };
  });
}
function cleanOldMessages(channelState) {
  return getOldMessages(channelState.db, channelState.options.idb.ttl).then(function(tooOld) {
    return removeMessagesById(channelState, tooOld.map(function(msg) {
      return msg.id;
    }));
  });
}
function create2(channelName, options) {
  options = fillOptionsWithDefaults(options);
  return createDatabase(channelName).then(function(db) {
    var state = {
      closed: false,
      lastCursorId: 0,
      channelName,
      options,
      uuid: randomToken(),
      /**
       * emittedMessagesIds
       * contains all messages that have been emitted before
       * @type {ObliviousSet}
       */
      eMIs: new ObliviousSet(options.idb.ttl * 2),
      // ensures we do not read messages in parallel
      writeBlockPromise: PROMISE_RESOLVED_VOID,
      messagesCallback: null,
      readQueuePromises: [],
      db
    };
    db.onclose = function() {
      state.closed = true;
      if (options.idb.onclose) options.idb.onclose();
    };
    _readLoop(state);
    return state;
  });
}
function _readLoop(state) {
  if (state.closed) return;
  readNewMessages(state).then(function() {
    return sleep(state.options.idb.fallbackInterval);
  }).then(function() {
    return _readLoop(state);
  });
}
function _filterMessage(msgObj, state) {
  if (msgObj.uuid === state.uuid) return false;
  if (state.eMIs.has(msgObj.id)) return false;
  if (msgObj.data.time < state.messagesCallbackTime) return false;
  return true;
}
function readNewMessages(state) {
  if (state.closed) return PROMISE_RESOLVED_VOID;
  if (!state.messagesCallback) return PROMISE_RESOLVED_VOID;
  return getMessagesHigherThan(state.db, state.lastCursorId).then(function(newerMessages) {
    var useMessages = newerMessages.filter(function(msgObj) {
      return !!msgObj;
    }).map(function(msgObj) {
      if (msgObj.id > state.lastCursorId) {
        state.lastCursorId = msgObj.id;
      }
      return msgObj;
    }).filter(function(msgObj) {
      return _filterMessage(msgObj, state);
    }).sort(function(msgObjA, msgObjB) {
      return msgObjA.time - msgObjB.time;
    });
    useMessages.forEach(function(msgObj) {
      if (state.messagesCallback) {
        state.eMIs.add(msgObj.id);
        state.messagesCallback(msgObj.data);
      }
    });
    return PROMISE_RESOLVED_VOID;
  });
}
function close2(channelState) {
  channelState.closed = true;
  channelState.db.close();
}
function postMessage2(channelState, messageJson) {
  channelState.writeBlockPromise = channelState.writeBlockPromise.then(function() {
    return writeMessage(channelState.db, channelState.uuid, messageJson);
  }).then(function() {
    if (randomInt(0, 10) === 0) {
      cleanOldMessages(channelState);
    }
  });
  return channelState.writeBlockPromise;
}
function onMessage2(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
  readNewMessages(channelState);
}
function canBeUsed2() {
  return !!getIdb();
}
function averageResponseTime2(options) {
  return options.idb.fallbackInterval * 2;
}
var microSeconds3, DB_PREFIX, OBJECT_STORE_ID, TRANSACTION_SETTINGS, type2, IndexedDBMethod;
var init_indexed_db = __esm({
  "node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/methods/indexed-db.js"() {
    init_util();
    init_src();
    init_options();
    microSeconds3 = microSeconds;
    DB_PREFIX = "pubkey.broadcast-channel-0-";
    OBJECT_STORE_ID = "messages";
    TRANSACTION_SETTINGS = {
      durability: "relaxed"
    };
    type2 = "idb";
    IndexedDBMethod = {
      create: create2,
      close: close2,
      onMessage: onMessage2,
      postMessage: postMessage2,
      canBeUsed: canBeUsed2,
      type: type2,
      averageResponseTime: averageResponseTime2,
      microSeconds: microSeconds3
    };
  }
});

// node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/methods/localstorage.js
function getLocalStorage() {
  var localStorage;
  if (typeof window === "undefined") return null;
  try {
    localStorage = window.localStorage;
    localStorage = window["ie8-eventlistener/storage"] || window.localStorage;
  } catch (e10) {
  }
  return localStorage;
}
function storageKey(channelName) {
  return KEY_PREFIX + channelName;
}
function postMessage3(channelState, messageJson) {
  return new Promise(function(res) {
    sleep().then(function() {
      var key = storageKey(channelState.channelName);
      var writeObj = {
        token: randomToken(),
        time: Date.now(),
        data: messageJson,
        uuid: channelState.uuid
      };
      var value = JSON.stringify(writeObj);
      getLocalStorage().setItem(key, value);
      var ev = document.createEvent("Event");
      ev.initEvent("storage", true, true);
      ev.key = key;
      ev.newValue = value;
      window.dispatchEvent(ev);
      res();
    });
  });
}
function addStorageEventListener(channelName, fn) {
  var key = storageKey(channelName);
  var listener = function listener2(ev) {
    if (ev.key === key) {
      fn(JSON.parse(ev.newValue));
    }
  };
  window.addEventListener("storage", listener);
  return listener;
}
function removeStorageEventListener(listener) {
  window.removeEventListener("storage", listener);
}
function create3(channelName, options) {
  options = fillOptionsWithDefaults(options);
  if (!canBeUsed3()) {
    throw new Error("BroadcastChannel: localstorage cannot be used");
  }
  var uuid = randomToken();
  var eMIs = new ObliviousSet(options.localstorage.removeTimeout);
  var state = {
    channelName,
    uuid,
    eMIs
    // emittedMessagesIds
  };
  state.listener = addStorageEventListener(channelName, function(msgObj) {
    if (!state.messagesCallback) return;
    if (msgObj.uuid === uuid) return;
    if (!msgObj.token || eMIs.has(msgObj.token)) return;
    if (msgObj.data.time && msgObj.data.time < state.messagesCallbackTime) return;
    eMIs.add(msgObj.token);
    state.messagesCallback(msgObj.data);
  });
  return state;
}
function close3(channelState) {
  removeStorageEventListener(channelState.listener);
}
function onMessage3(channelState, fn, time) {
  channelState.messagesCallbackTime = time;
  channelState.messagesCallback = fn;
}
function canBeUsed3() {
  var ls = getLocalStorage();
  if (!ls) return false;
  try {
    var key = "__broadcastchannel_check";
    ls.setItem(key, "works");
    ls.removeItem(key);
  } catch (e10) {
    return false;
  }
  return true;
}
function averageResponseTime3() {
  var defaultTime = 120;
  var userAgent = navigator.userAgent.toLowerCase();
  if (userAgent.includes("safari") && !userAgent.includes("chrome")) {
    return defaultTime * 2;
  }
  return defaultTime;
}
var microSeconds4, KEY_PREFIX, type3, LocalstorageMethod;
var init_localstorage = __esm({
  "node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/methods/localstorage.js"() {
    init_src();
    init_options();
    init_util();
    microSeconds4 = microSeconds;
    KEY_PREFIX = "pubkey.broadcastChannel-";
    type3 = "localstorage";
    LocalstorageMethod = {
      create: create3,
      close: close3,
      onMessage: onMessage3,
      postMessage: postMessage3,
      canBeUsed: canBeUsed3,
      type: type3,
      averageResponseTime: averageResponseTime3,
      microSeconds: microSeconds4
    };
  }
});

// node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/methods/simulate.js
function create4(channelName) {
  var state = {
    time: microSeconds5(),
    name: channelName,
    messagesCallback: null
  };
  SIMULATE_CHANNELS.add(state);
  return state;
}
function close4(channelState) {
  SIMULATE_CHANNELS["delete"](channelState);
}
function postMessage4(channelState, messageJson) {
  return new Promise(function(res) {
    return setTimeout(function() {
      var channelArray = Array.from(SIMULATE_CHANNELS);
      channelArray.forEach(function(channel) {
        if (channel.name === channelState.name && // has same name
        channel !== channelState && // not own channel
        !!channel.messagesCallback && // has subscribers
        channel.time < messageJson.time) {
          channel.messagesCallback(messageJson);
        }
      });
      res();
    }, SIMULATE_DELAY_TIME);
  });
}
function onMessage4(channelState, fn) {
  channelState.messagesCallback = fn;
}
function canBeUsed4() {
  return true;
}
function averageResponseTime4() {
  return SIMULATE_DELAY_TIME;
}
var microSeconds5, type4, SIMULATE_CHANNELS, SIMULATE_DELAY_TIME, SimulateMethod;
var init_simulate = __esm({
  "node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/methods/simulate.js"() {
    init_util();
    microSeconds5 = microSeconds;
    type4 = "simulate";
    SIMULATE_CHANNELS = /* @__PURE__ */ new Set();
    SIMULATE_DELAY_TIME = 5;
    SimulateMethod = {
      create: create4,
      close: close4,
      onMessage: onMessage4,
      postMessage: postMessage4,
      canBeUsed: canBeUsed4,
      type: type4,
      averageResponseTime: averageResponseTime4,
      microSeconds: microSeconds5
    };
  }
});

// node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/method-chooser.js
function chooseMethod(options) {
  var chooseMethods = [].concat(options.methods, METHODS).filter(Boolean);
  if (options.type) {
    if (options.type === "simulate") {
      return SimulateMethod;
    }
    var ret = chooseMethods.find(function(m2) {
      return m2.type === options.type;
    });
    if (!ret) throw new Error("method-type " + options.type + " not found");
    else return ret;
  }
  if (!options.webWorkerSupport) {
    chooseMethods = chooseMethods.filter(function(m2) {
      return m2.type !== "idb";
    });
  }
  var useMethod = chooseMethods.find(function(method) {
    return method.canBeUsed();
  });
  if (!useMethod) {
    throw new Error("No usable method found in " + JSON.stringify(METHODS.map(function(m2) {
      return m2.type;
    })));
  } else {
    return useMethod;
  }
}
var METHODS;
var init_method_chooser = __esm({
  "node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/method-chooser.js"() {
    init_native();
    init_indexed_db();
    init_localstorage();
    init_simulate();
    METHODS = [
      NativeMethod,
      // fastest
      IndexedDBMethod,
      LocalstorageMethod
    ];
  }
});

// node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/broadcast-channel.js
function _post(broadcastChannel, type5, msg) {
  var time = broadcastChannel.method.microSeconds();
  var msgObj = {
    time,
    type: type5,
    data: msg
  };
  var awaitPrepare = broadcastChannel._prepP ? broadcastChannel._prepP : PROMISE_RESOLVED_VOID;
  return awaitPrepare.then(function() {
    var sendPromise = broadcastChannel.method.postMessage(broadcastChannel._state, msgObj);
    broadcastChannel._uMP.add(sendPromise);
    sendPromise["catch"]().then(function() {
      return broadcastChannel._uMP["delete"](sendPromise);
    });
    return sendPromise;
  });
}
function _prepareChannel(channel) {
  var maybePromise = channel.method.create(channel.name, channel.options);
  if (isPromise(maybePromise)) {
    channel._prepP = maybePromise;
    maybePromise.then(function(s4) {
      channel._state = s4;
    });
  } else {
    channel._state = maybePromise;
  }
}
function _hasMessageListeners(channel) {
  if (channel._addEL.message.length > 0) return true;
  if (channel._addEL.internal.length > 0) return true;
  return false;
}
function _addListenerObject(channel, type5, obj) {
  channel._addEL[type5].push(obj);
  _startListening(channel);
}
function _removeListenerObject(channel, type5, obj) {
  channel._addEL[type5] = channel._addEL[type5].filter(function(o10) {
    return o10 !== obj;
  });
  _stopListening(channel);
}
function _startListening(channel) {
  if (!channel._iL && _hasMessageListeners(channel)) {
    var listenerFn = function listenerFn2(msgObj) {
      channel._addEL[msgObj.type].forEach(function(listenerObject) {
        if (msgObj.time >= listenerObject.time) {
          listenerObject.fn(msgObj.data);
        }
      });
    };
    var time = channel.method.microSeconds();
    if (channel._prepP) {
      channel._prepP.then(function() {
        channel._iL = true;
        channel.method.onMessage(channel._state, listenerFn, time);
      });
    } else {
      channel._iL = true;
      channel.method.onMessage(channel._state, listenerFn, time);
    }
  }
}
function _stopListening(channel) {
  if (channel._iL && !_hasMessageListeners(channel)) {
    channel._iL = false;
    var time = channel.method.microSeconds();
    channel.method.onMessage(channel._state, null, time);
  }
}
var OPEN_BROADCAST_CHANNELS, lastId, BroadcastChannel2, ENFORCED_OPTIONS;
var init_broadcast_channel = __esm({
  "node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/broadcast-channel.js"() {
    init_util();
    init_method_chooser();
    init_options();
    OPEN_BROADCAST_CHANNELS = /* @__PURE__ */ new Set();
    lastId = 0;
    BroadcastChannel2 = function BroadcastChannel3(name, options) {
      this.id = lastId++;
      OPEN_BROADCAST_CHANNELS.add(this);
      this.name = name;
      if (ENFORCED_OPTIONS) {
        options = ENFORCED_OPTIONS;
      }
      this.options = fillOptionsWithDefaults(options);
      this.method = chooseMethod(this.options);
      this._iL = false;
      this._onML = null;
      this._addEL = {
        message: [],
        internal: []
      };
      this._uMP = /* @__PURE__ */ new Set();
      this._befC = [];
      this._prepP = null;
      _prepareChannel(this);
    };
    BroadcastChannel2._pubkey = true;
    BroadcastChannel2.prototype = {
      postMessage: function postMessage5(msg) {
        if (this.closed) {
          throw new Error("BroadcastChannel.postMessage(): Cannot post message after channel has closed " + /**
           * In the past when this error appeared, it was really hard to debug.
           * So now we log the msg together with the error so it at least
           * gives some clue about where in your application this happens.
           */
          JSON.stringify(msg));
        }
        return _post(this, "message", msg);
      },
      postInternal: function postInternal(msg) {
        return _post(this, "internal", msg);
      },
      set onmessage(fn) {
        var time = this.method.microSeconds();
        var listenObj = {
          time,
          fn
        };
        _removeListenerObject(this, "message", this._onML);
        if (fn && typeof fn === "function") {
          this._onML = listenObj;
          _addListenerObject(this, "message", listenObj);
        } else {
          this._onML = null;
        }
      },
      addEventListener: function addEventListener(type5, fn) {
        var time = this.method.microSeconds();
        var listenObj = {
          time,
          fn
        };
        _addListenerObject(this, type5, listenObj);
      },
      removeEventListener: function removeEventListener(type5, fn) {
        var obj = this._addEL[type5].find(function(obj2) {
          return obj2.fn === fn;
        });
        _removeListenerObject(this, type5, obj);
      },
      close: function close5() {
        var _this = this;
        if (this.closed) {
          return;
        }
        OPEN_BROADCAST_CHANNELS["delete"](this);
        this.closed = true;
        var awaitPrepare = this._prepP ? this._prepP : PROMISE_RESOLVED_VOID;
        this._onML = null;
        this._addEL.message = [];
        return awaitPrepare.then(function() {
          return Promise.all(Array.from(_this._uMP));
        }).then(function() {
          return Promise.all(_this._befC.map(function(fn) {
            return fn();
          }));
        }).then(function() {
          return _this.method.close(_this._state);
        });
      },
      get type() {
        return this.method.type;
      },
      get isClosed() {
        return this.closed;
      }
    };
  }
});

// node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/index.js
var init_esbrowser = __esm({
  "node_modules/.pnpm/broadcast-channel@7.0.0/node_modules/broadcast-channel/dist/esbrowser/index.js"() {
    init_broadcast_channel();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3Y6SB6QS.js
function setBasePath(path) {
  basePath = path;
}
function getBasePath(subpath = "") {
  if (!basePath) {
    const scripts = [...document.getElementsByTagName("script")];
    const configScript = scripts.find((script) => script.hasAttribute("data-shoelace"));
    if (configScript) {
      setBasePath(configScript.getAttribute("data-shoelace"));
    } else {
      const fallbackScript = scripts.find((s4) => {
        return /shoelace(\.min)?\.js($|\?)/.test(s4.src) || /shoelace-autoloader(\.min)?\.js($|\?)/.test(s4.src);
      });
      let path = "";
      if (fallbackScript) {
        path = fallbackScript.getAttribute("src");
      }
      setBasePath(path.split("/").slice(0, -1).join("/"));
    }
  }
  return basePath.replace(/\/$/, "") + (subpath ? `/${subpath.replace(/^\//, "")}` : ``);
}
var basePath;
var init_chunk_3Y6SB6QS = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3Y6SB6QS.js"() {
    basePath = "";
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.B3BW2AY6.js
var __defProp2, __defProps, __getOwnPropDesc, __getOwnPropDescs, __getOwnPropSymbols, __hasOwnProp, __propIsEnum, __defNormalProp2, __spreadValues, __spreadProps, __decorateClass, __accessCheck, __privateGet, __privateAdd, __privateSet;
var init_chunk_B3BW2AY6 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.B3BW2AY6.js"() {
    __defProp2 = Object.defineProperty;
    __defProps = Object.defineProperties;
    __getOwnPropDesc = Object.getOwnPropertyDescriptor;
    __getOwnPropDescs = Object.getOwnPropertyDescriptors;
    __getOwnPropSymbols = Object.getOwnPropertySymbols;
    __hasOwnProp = Object.prototype.hasOwnProperty;
    __propIsEnum = Object.prototype.propertyIsEnumerable;
    __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
    __spreadValues = (a4, b3) => {
      for (var prop in b3 || (b3 = {}))
        if (__hasOwnProp.call(b3, prop))
          __defNormalProp2(a4, prop, b3[prop]);
      if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b3)) {
          if (__propIsEnum.call(b3, prop))
            __defNormalProp2(a4, prop, b3[prop]);
        }
      return a4;
    };
    __spreadProps = (a4, b3) => __defProps(a4, __getOwnPropDescs(b3));
    __decorateClass = (decorators, target, key, kind) => {
      var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
      for (var i7 = decorators.length - 1, decorator; i7 >= 0; i7--)
        if (decorator = decorators[i7])
          result = (kind ? decorator(target, key, result) : decorator(result)) || result;
      if (kind && result)
        __defProp2(target, key, result);
      return result;
    };
    __accessCheck = (obj, member, msg) => {
      if (!member.has(obj))
        throw TypeError("Cannot " + msg);
    };
    __privateGet = (obj, member, getter) => {
      __accessCheck(obj, member, "read from private field");
      return getter ? getter.call(obj) : member.get(obj);
    };
    __privateAdd = (obj, member, value) => {
      if (member.has(obj))
        throw TypeError("Cannot add the same private member more than once");
      member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
    };
    __privateSet = (obj, member, value, setter) => {
      __accessCheck(obj, member, "write to private field");
      setter ? setter.call(obj, value) : member.set(obj, value);
      return value;
    };
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/utilities/base-path.js
var init_base_path = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/utilities/base-path.js"() {
    init_chunk_3Y6SB6QS();
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/css-tag.js
var t, e, s, o, n, r, i, S, c;
var init_css_tag = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/css-tag.js"() {
    t = globalThis;
    e = t.ShadowRoot && (void 0 === t.ShadyCSS || t.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype;
    s = Symbol();
    o = /* @__PURE__ */ new WeakMap();
    n = class {
      constructor(t6, e10, o10) {
        if (this._$cssResult$ = true, o10 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t6, this.t = e10;
      }
      get styleSheet() {
        let t6 = this.o;
        const s4 = this.t;
        if (e && void 0 === t6) {
          const e10 = void 0 !== s4 && 1 === s4.length;
          e10 && (t6 = o.get(s4)), void 0 === t6 && ((this.o = t6 = new CSSStyleSheet()).replaceSync(this.cssText), e10 && o.set(s4, t6));
        }
        return t6;
      }
      toString() {
        return this.cssText;
      }
    };
    r = (t6) => new n("string" == typeof t6 ? t6 : t6 + "", void 0, s);
    i = (t6, ...e10) => {
      const o10 = 1 === t6.length ? t6[0] : e10.reduce((e11, s4, o11) => e11 + ((t7) => {
        if (true === t7._$cssResult$) return t7.cssText;
        if ("number" == typeof t7) return t7;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t7 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(s4) + t6[o11 + 1], t6[0]);
      return new n(o10, t6, s);
    };
    S = (s4, o10) => {
      if (e) s4.adoptedStyleSheets = o10.map((t6) => t6 instanceof CSSStyleSheet ? t6 : t6.styleSheet);
      else for (const e10 of o10) {
        const o11 = document.createElement("style"), n8 = t.litNonce;
        void 0 !== n8 && o11.setAttribute("nonce", n8), o11.textContent = e10.cssText, s4.appendChild(o11);
      }
    };
    c = e ? (t6) => t6 : (t6) => t6 instanceof CSSStyleSheet ? ((t7) => {
      let e10 = "";
      for (const s4 of t7.cssRules) e10 += s4.cssText;
      return r(e10);
    })(t6) : t6;
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/reactive-element.js
var i2, e2, r2, h, o2, n2, a, c2, l, p, d, u, f, y, b;
var init_reactive_element = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/reactive-element.js"() {
    init_css_tag();
    init_css_tag();
    ({ is: i2, defineProperty: e2, getOwnPropertyDescriptor: r2, getOwnPropertyNames: h, getOwnPropertySymbols: o2, getPrototypeOf: n2 } = Object);
    a = globalThis;
    c2 = a.trustedTypes;
    l = c2 ? c2.emptyScript : "";
    p = a.reactiveElementPolyfillSupport;
    d = (t6, s4) => t6;
    u = { toAttribute(t6, s4) {
      switch (s4) {
        case Boolean:
          t6 = t6 ? l : null;
          break;
        case Object:
        case Array:
          t6 = null == t6 ? t6 : JSON.stringify(t6);
      }
      return t6;
    }, fromAttribute(t6, s4) {
      let i7 = t6;
      switch (s4) {
        case Boolean:
          i7 = null !== t6;
          break;
        case Number:
          i7 = null === t6 ? null : Number(t6);
          break;
        case Object:
        case Array:
          try {
            i7 = JSON.parse(t6);
          } catch (t7) {
            i7 = null;
          }
      }
      return i7;
    } };
    f = (t6, s4) => !i2(t6, s4);
    y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
    Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
    b = class extends HTMLElement {
      static addInitializer(t6) {
        this._$Ei(), (this.l ?? (this.l = [])).push(t6);
      }
      static get observedAttributes() {
        return this.finalize(), this._$Eh && [...this._$Eh.keys()];
      }
      static createProperty(t6, s4 = y) {
        if (s4.state && (s4.attribute = false), this._$Ei(), this.elementProperties.set(t6, s4), !s4.noAccessor) {
          const i7 = Symbol(), r9 = this.getPropertyDescriptor(t6, i7, s4);
          void 0 !== r9 && e2(this.prototype, t6, r9);
        }
      }
      static getPropertyDescriptor(t6, s4, i7) {
        const { get: e10, set: h5 } = r2(this.prototype, t6) ?? { get() {
          return this[s4];
        }, set(t7) {
          this[s4] = t7;
        } };
        return { get() {
          return e10?.call(this);
        }, set(s5) {
          const r9 = e10?.call(this);
          h5.call(this, s5), this.requestUpdate(t6, r9, i7);
        }, configurable: true, enumerable: true };
      }
      static getPropertyOptions(t6) {
        return this.elementProperties.get(t6) ?? y;
      }
      static _$Ei() {
        if (this.hasOwnProperty(d("elementProperties"))) return;
        const t6 = n2(this);
        t6.finalize(), void 0 !== t6.l && (this.l = [...t6.l]), this.elementProperties = new Map(t6.elementProperties);
      }
      static finalize() {
        if (this.hasOwnProperty(d("finalized"))) return;
        if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
          const t7 = this.properties, s4 = [...h(t7), ...o2(t7)];
          for (const i7 of s4) this.createProperty(i7, t7[i7]);
        }
        const t6 = this[Symbol.metadata];
        if (null !== t6) {
          const s4 = litPropertyMetadata.get(t6);
          if (void 0 !== s4) for (const [t7, i7] of s4) this.elementProperties.set(t7, i7);
        }
        this._$Eh = /* @__PURE__ */ new Map();
        for (const [t7, s4] of this.elementProperties) {
          const i7 = this._$Eu(t7, s4);
          void 0 !== i7 && this._$Eh.set(i7, t7);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
      }
      static finalizeStyles(s4) {
        const i7 = [];
        if (Array.isArray(s4)) {
          const e10 = new Set(s4.flat(1 / 0).reverse());
          for (const s5 of e10) i7.unshift(c(s5));
        } else void 0 !== s4 && i7.push(c(s4));
        return i7;
      }
      static _$Eu(t6, s4) {
        const i7 = s4.attribute;
        return false === i7 ? void 0 : "string" == typeof i7 ? i7 : "string" == typeof t6 ? t6.toLowerCase() : void 0;
      }
      constructor() {
        super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
      }
      _$Ev() {
        this._$ES = new Promise((t6) => this.enableUpdating = t6), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t6) => t6(this));
      }
      addController(t6) {
        (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t6), void 0 !== this.renderRoot && this.isConnected && t6.hostConnected?.();
      }
      removeController(t6) {
        this._$EO?.delete(t6);
      }
      _$E_() {
        const t6 = /* @__PURE__ */ new Map(), s4 = this.constructor.elementProperties;
        for (const i7 of s4.keys()) this.hasOwnProperty(i7) && (t6.set(i7, this[i7]), delete this[i7]);
        t6.size > 0 && (this._$Ep = t6);
      }
      createRenderRoot() {
        const t6 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return S(t6, this.constructor.elementStyles), t6;
      }
      connectedCallback() {
        this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t6) => t6.hostConnected?.());
      }
      enableUpdating(t6) {
      }
      disconnectedCallback() {
        this._$EO?.forEach((t6) => t6.hostDisconnected?.());
      }
      attributeChangedCallback(t6, s4, i7) {
        this._$AK(t6, i7);
      }
      _$EC(t6, s4) {
        const i7 = this.constructor.elementProperties.get(t6), e10 = this.constructor._$Eu(t6, i7);
        if (void 0 !== e10 && true === i7.reflect) {
          const r9 = (void 0 !== i7.converter?.toAttribute ? i7.converter : u).toAttribute(s4, i7.type);
          this._$Em = t6, null == r9 ? this.removeAttribute(e10) : this.setAttribute(e10, r9), this._$Em = null;
        }
      }
      _$AK(t6, s4) {
        const i7 = this.constructor, e10 = i7._$Eh.get(t6);
        if (void 0 !== e10 && this._$Em !== e10) {
          const t7 = i7.getPropertyOptions(e10), r9 = "function" == typeof t7.converter ? { fromAttribute: t7.converter } : void 0 !== t7.converter?.fromAttribute ? t7.converter : u;
          this._$Em = e10, this[e10] = r9.fromAttribute(s4, t7.type), this._$Em = null;
        }
      }
      requestUpdate(t6, s4, i7) {
        if (void 0 !== t6) {
          if (i7 ?? (i7 = this.constructor.getPropertyOptions(t6)), !(i7.hasChanged ?? f)(this[t6], s4)) return;
          this.P(t6, s4, i7);
        }
        false === this.isUpdatePending && (this._$ES = this._$ET());
      }
      P(t6, s4, i7) {
        this._$AL.has(t6) || this._$AL.set(t6, s4), true === i7.reflect && this._$Em !== t6 && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t6);
      }
      async _$ET() {
        this.isUpdatePending = true;
        try {
          await this._$ES;
        } catch (t7) {
          Promise.reject(t7);
        }
        const t6 = this.scheduleUpdate();
        return null != t6 && await t6, !this.isUpdatePending;
      }
      scheduleUpdate() {
        return this.performUpdate();
      }
      performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
          if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
            for (const [t8, s5] of this._$Ep) this[t8] = s5;
            this._$Ep = void 0;
          }
          const t7 = this.constructor.elementProperties;
          if (t7.size > 0) for (const [s5, i7] of t7) true !== i7.wrapped || this._$AL.has(s5) || void 0 === this[s5] || this.P(s5, this[s5], i7);
        }
        let t6 = false;
        const s4 = this._$AL;
        try {
          t6 = this.shouldUpdate(s4), t6 ? (this.willUpdate(s4), this._$EO?.forEach((t7) => t7.hostUpdate?.()), this.update(s4)) : this._$EU();
        } catch (s5) {
          throw t6 = false, this._$EU(), s5;
        }
        t6 && this._$AE(s4);
      }
      willUpdate(t6) {
      }
      _$AE(t6) {
        this._$EO?.forEach((t7) => t7.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t6)), this.updated(t6);
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
      shouldUpdate(t6) {
        return true;
      }
      update(t6) {
        this._$Ej && (this._$Ej = this._$Ej.forEach((t7) => this._$EC(t7, this[t7]))), this._$EU();
      }
      updated(t6) {
      }
      firstUpdated(t6) {
      }
    };
    b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.0.4");
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/lit-html.js
function P(t6, i7) {
  if (!a2(t6) || !t6.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s2 ? s2.createHTML(i7) : i7;
}
function S2(t6, i7, s4 = t6, e10) {
  if (i7 === T) return i7;
  let h5 = void 0 !== e10 ? s4._$Co?.[e10] : s4._$Cl;
  const o10 = c3(i7) ? void 0 : i7._$litDirective$;
  return h5?.constructor !== o10 && (h5?._$AO?.(false), void 0 === o10 ? h5 = void 0 : (h5 = new o10(t6), h5._$AT(t6, s4, e10)), void 0 !== e10 ? (s4._$Co ?? (s4._$Co = []))[e10] = h5 : s4._$Cl = h5), void 0 !== h5 && (i7 = S2(t6, h5._$AS(t6, i7.values), h5, e10)), i7;
}
var t2, i3, s2, e3, h2, o3, n3, r3, l2, c3, a2, u2, d2, f2, v, _, m, p2, g, $, y2, x, b2, w, T, E, A, C, V, N, M, R, k, H, I, L, z, Z, j, B;
var init_lit_html = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/lit-html.js"() {
    t2 = globalThis;
    i3 = t2.trustedTypes;
    s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t6) => t6 }) : void 0;
    e3 = "$lit$";
    h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
    o3 = "?" + h2;
    n3 = `<${o3}>`;
    r3 = document;
    l2 = () => r3.createComment("");
    c3 = (t6) => null === t6 || "object" != typeof t6 && "function" != typeof t6;
    a2 = Array.isArray;
    u2 = (t6) => a2(t6) || "function" == typeof t6?.[Symbol.iterator];
    d2 = "[ 	\n\f\r]";
    f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
    v = /-->/g;
    _ = />/g;
    m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
    p2 = /'/g;
    g = /"/g;
    $ = /^(?:script|style|textarea|title)$/i;
    y2 = (t6) => (i7, ...s4) => ({ _$litType$: t6, strings: i7, values: s4 });
    x = y2(1);
    b2 = y2(2);
    w = y2(3);
    T = Symbol.for("lit-noChange");
    E = Symbol.for("lit-nothing");
    A = /* @__PURE__ */ new WeakMap();
    C = r3.createTreeWalker(r3, 129);
    V = (t6, i7) => {
      const s4 = t6.length - 1, o10 = [];
      let r9, l4 = 2 === i7 ? "<svg>" : 3 === i7 ? "<math>" : "", c6 = f2;
      for (let i8 = 0; i8 < s4; i8++) {
        const s5 = t6[i8];
        let a4, u4, d3 = -1, y3 = 0;
        for (; y3 < s5.length && (c6.lastIndex = y3, u4 = c6.exec(s5), null !== u4); ) y3 = c6.lastIndex, c6 === f2 ? "!--" === u4[1] ? c6 = v : void 0 !== u4[1] ? c6 = _ : void 0 !== u4[2] ? ($.test(u4[2]) && (r9 = RegExp("</" + u4[2], "g")), c6 = m) : void 0 !== u4[3] && (c6 = m) : c6 === m ? ">" === u4[0] ? (c6 = r9 ?? f2, d3 = -1) : void 0 === u4[1] ? d3 = -2 : (d3 = c6.lastIndex - u4[2].length, a4 = u4[1], c6 = void 0 === u4[3] ? m : '"' === u4[3] ? g : p2) : c6 === g || c6 === p2 ? c6 = m : c6 === v || c6 === _ ? c6 = f2 : (c6 = m, r9 = void 0);
        const x2 = c6 === m && t6[i8 + 1].startsWith("/>") ? " " : "";
        l4 += c6 === f2 ? s5 + n3 : d3 >= 0 ? (o10.push(a4), s5.slice(0, d3) + e3 + s5.slice(d3) + h2 + x2) : s5 + h2 + (-2 === d3 ? i8 : x2);
      }
      return [P(t6, l4 + (t6[s4] || "<?>") + (2 === i7 ? "</svg>" : 3 === i7 ? "</math>" : "")), o10];
    };
    N = class _N {
      constructor({ strings: t6, _$litType$: s4 }, n8) {
        let r9;
        this.parts = [];
        let c6 = 0, a4 = 0;
        const u4 = t6.length - 1, d3 = this.parts, [f5, v2] = V(t6, s4);
        if (this.el = _N.createElement(f5, n8), C.currentNode = this.el.content, 2 === s4 || 3 === s4) {
          const t7 = this.el.content.firstChild;
          t7.replaceWith(...t7.childNodes);
        }
        for (; null !== (r9 = C.nextNode()) && d3.length < u4; ) {
          if (1 === r9.nodeType) {
            if (r9.hasAttributes()) for (const t7 of r9.getAttributeNames()) if (t7.endsWith(e3)) {
              const i7 = v2[a4++], s5 = r9.getAttribute(t7).split(h2), e10 = /([.?@])?(.*)/.exec(i7);
              d3.push({ type: 1, index: c6, name: e10[2], strings: s5, ctor: "." === e10[1] ? H : "?" === e10[1] ? I : "@" === e10[1] ? L : k }), r9.removeAttribute(t7);
            } else t7.startsWith(h2) && (d3.push({ type: 6, index: c6 }), r9.removeAttribute(t7));
            if ($.test(r9.tagName)) {
              const t7 = r9.textContent.split(h2), s5 = t7.length - 1;
              if (s5 > 0) {
                r9.textContent = i3 ? i3.emptyScript : "";
                for (let i7 = 0; i7 < s5; i7++) r9.append(t7[i7], l2()), C.nextNode(), d3.push({ type: 2, index: ++c6 });
                r9.append(t7[s5], l2());
              }
            }
          } else if (8 === r9.nodeType) if (r9.data === o3) d3.push({ type: 2, index: c6 });
          else {
            let t7 = -1;
            for (; -1 !== (t7 = r9.data.indexOf(h2, t7 + 1)); ) d3.push({ type: 7, index: c6 }), t7 += h2.length - 1;
          }
          c6++;
        }
      }
      static createElement(t6, i7) {
        const s4 = r3.createElement("template");
        return s4.innerHTML = t6, s4;
      }
    };
    M = class {
      constructor(t6, i7) {
        this._$AV = [], this._$AN = void 0, this._$AD = t6, this._$AM = i7;
      }
      get parentNode() {
        return this._$AM.parentNode;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      u(t6) {
        const { el: { content: i7 }, parts: s4 } = this._$AD, e10 = (t6?.creationScope ?? r3).importNode(i7, true);
        C.currentNode = e10;
        let h5 = C.nextNode(), o10 = 0, n8 = 0, l4 = s4[0];
        for (; void 0 !== l4; ) {
          if (o10 === l4.index) {
            let i8;
            2 === l4.type ? i8 = new R(h5, h5.nextSibling, this, t6) : 1 === l4.type ? i8 = new l4.ctor(h5, l4.name, l4.strings, this, t6) : 6 === l4.type && (i8 = new z(h5, this, t6)), this._$AV.push(i8), l4 = s4[++n8];
          }
          o10 !== l4?.index && (h5 = C.nextNode(), o10++);
        }
        return C.currentNode = r3, e10;
      }
      p(t6) {
        let i7 = 0;
        for (const s4 of this._$AV) void 0 !== s4 && (void 0 !== s4.strings ? (s4._$AI(t6, s4, i7), i7 += s4.strings.length - 2) : s4._$AI(t6[i7])), i7++;
      }
    };
    R = class _R {
      get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
      }
      constructor(t6, i7, s4, e10) {
        this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t6, this._$AB = i7, this._$AM = s4, this.options = e10, this._$Cv = e10?.isConnected ?? true;
      }
      get parentNode() {
        let t6 = this._$AA.parentNode;
        const i7 = this._$AM;
        return void 0 !== i7 && 11 === t6?.nodeType && (t6 = i7.parentNode), t6;
      }
      get startNode() {
        return this._$AA;
      }
      get endNode() {
        return this._$AB;
      }
      _$AI(t6, i7 = this) {
        t6 = S2(this, t6, i7), c3(t6) ? t6 === E || null == t6 || "" === t6 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t6 !== this._$AH && t6 !== T && this._(t6) : void 0 !== t6._$litType$ ? this.$(t6) : void 0 !== t6.nodeType ? this.T(t6) : u2(t6) ? this.k(t6) : this._(t6);
      }
      O(t6) {
        return this._$AA.parentNode.insertBefore(t6, this._$AB);
      }
      T(t6) {
        this._$AH !== t6 && (this._$AR(), this._$AH = this.O(t6));
      }
      _(t6) {
        this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t6 : this.T(r3.createTextNode(t6)), this._$AH = t6;
      }
      $(t6) {
        const { values: i7, _$litType$: s4 } = t6, e10 = "number" == typeof s4 ? this._$AC(t6) : (void 0 === s4.el && (s4.el = N.createElement(P(s4.h, s4.h[0]), this.options)), s4);
        if (this._$AH?._$AD === e10) this._$AH.p(i7);
        else {
          const t7 = new M(e10, this), s5 = t7.u(this.options);
          t7.p(i7), this.T(s5), this._$AH = t7;
        }
      }
      _$AC(t6) {
        let i7 = A.get(t6.strings);
        return void 0 === i7 && A.set(t6.strings, i7 = new N(t6)), i7;
      }
      k(t6) {
        a2(this._$AH) || (this._$AH = [], this._$AR());
        const i7 = this._$AH;
        let s4, e10 = 0;
        for (const h5 of t6) e10 === i7.length ? i7.push(s4 = new _R(this.O(l2()), this.O(l2()), this, this.options)) : s4 = i7[e10], s4._$AI(h5), e10++;
        e10 < i7.length && (this._$AR(s4 && s4._$AB.nextSibling, e10), i7.length = e10);
      }
      _$AR(t6 = this._$AA.nextSibling, i7) {
        for (this._$AP?.(false, true, i7); t6 && t6 !== this._$AB; ) {
          const i8 = t6.nextSibling;
          t6.remove(), t6 = i8;
        }
      }
      setConnected(t6) {
        void 0 === this._$AM && (this._$Cv = t6, this._$AP?.(t6));
      }
    };
    k = class {
      get tagName() {
        return this.element.tagName;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      constructor(t6, i7, s4, e10, h5) {
        this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t6, this.name = i7, this._$AM = e10, this.options = h5, s4.length > 2 || "" !== s4[0] || "" !== s4[1] ? (this._$AH = Array(s4.length - 1).fill(new String()), this.strings = s4) : this._$AH = E;
      }
      _$AI(t6, i7 = this, s4, e10) {
        const h5 = this.strings;
        let o10 = false;
        if (void 0 === h5) t6 = S2(this, t6, i7, 0), o10 = !c3(t6) || t6 !== this._$AH && t6 !== T, o10 && (this._$AH = t6);
        else {
          const e11 = t6;
          let n8, r9;
          for (t6 = h5[0], n8 = 0; n8 < h5.length - 1; n8++) r9 = S2(this, e11[s4 + n8], i7, n8), r9 === T && (r9 = this._$AH[n8]), o10 || (o10 = !c3(r9) || r9 !== this._$AH[n8]), r9 === E ? t6 = E : t6 !== E && (t6 += (r9 ?? "") + h5[n8 + 1]), this._$AH[n8] = r9;
        }
        o10 && !e10 && this.j(t6);
      }
      j(t6) {
        t6 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t6 ?? "");
      }
    };
    H = class extends k {
      constructor() {
        super(...arguments), this.type = 3;
      }
      j(t6) {
        this.element[this.name] = t6 === E ? void 0 : t6;
      }
    };
    I = class extends k {
      constructor() {
        super(...arguments), this.type = 4;
      }
      j(t6) {
        this.element.toggleAttribute(this.name, !!t6 && t6 !== E);
      }
    };
    L = class extends k {
      constructor(t6, i7, s4, e10, h5) {
        super(t6, i7, s4, e10, h5), this.type = 5;
      }
      _$AI(t6, i7 = this) {
        if ((t6 = S2(this, t6, i7, 0) ?? E) === T) return;
        const s4 = this._$AH, e10 = t6 === E && s4 !== E || t6.capture !== s4.capture || t6.once !== s4.once || t6.passive !== s4.passive, h5 = t6 !== E && (s4 === E || e10);
        e10 && this.element.removeEventListener(this.name, this, s4), h5 && this.element.addEventListener(this.name, this, t6), this._$AH = t6;
      }
      handleEvent(t6) {
        "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t6) : this._$AH.handleEvent(t6);
      }
    };
    z = class {
      constructor(t6, i7, s4) {
        this.element = t6, this.type = 6, this._$AN = void 0, this._$AM = i7, this.options = s4;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AI(t6) {
        S2(this, t6);
      }
    };
    Z = { M: e3, P: h2, A: o3, C: 1, L: V, R: M, D: u2, V: S2, I: R, H: k, N: I, U: L, B: H, F: z };
    j = t2.litHtmlPolyfillSupport;
    j?.(N, R), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.2.1");
    B = (t6, i7, s4) => {
      const e10 = s4?.renderBefore ?? i7;
      let h5 = e10._$litPart$;
      if (void 0 === h5) {
        const t7 = s4?.renderBefore ?? null;
        e10._$litPart$ = h5 = new R(i7.insertBefore(l2(), t7), t7, void 0, s4 ?? {});
      }
      return h5._$AI(t6), h5;
    };
  }
});

// node_modules/.pnpm/lit-element@4.1.1/node_modules/lit-element/lit-element.js
var r4, i4;
var init_lit_element = __esm({
  "node_modules/.pnpm/lit-element@4.1.1/node_modules/lit-element/lit-element.js"() {
    init_reactive_element();
    init_reactive_element();
    init_lit_html();
    init_lit_html();
    r4 = class extends b {
      constructor() {
        super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
      }
      createRenderRoot() {
        var _a;
        const t6 = super.createRenderRoot();
        return (_a = this.renderOptions).renderBefore ?? (_a.renderBefore = t6.firstChild), t6;
      }
      update(t6) {
        const s4 = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t6), this._$Do = B(s4, this.renderRoot, this.renderOptions);
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
    i4 = globalThis.litElementPolyfillSupport;
    i4?.({ LitElement: r4 });
    (globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.1.1");
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/is-server.js
var init_is_server = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/is-server.js"() {
  }
});

// node_modules/.pnpm/lit@3.2.1/node_modules/lit/index.js
var init_lit = __esm({
  "node_modules/.pnpm/lit@3.2.1/node_modules/lit/index.js"() {
    init_reactive_element();
    init_lit_html();
    init_lit_element();
    init_is_server();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.UAYXD3AN.js
var split_panel_styles_default;
var init_chunk_UAYXD3AN = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.UAYXD3AN.js"() {
    init_lit();
    split_panel_styles_default = i`
  :host {
    --divider-width: 4px;
    --divider-hit-area: 12px;
    --min: 0%;
    --max: 100%;

    display: grid;
  }

  .start,
  .end {
    overflow: hidden;
  }

  .divider {
    flex: 0 0 var(--divider-width);
    display: flex;
    position: relative;
    align-items: center;
    justify-content: center;
    background-color: var(--sl-color-neutral-200);
    color: var(--sl-color-neutral-900);
    z-index: 1;
  }

  .divider:focus {
    outline: none;
  }

  :host(:not([disabled])) .divider:focus-visible {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  :host([disabled]) .divider {
    cursor: not-allowed;
  }

  /* Horizontal */
  :host(:not([vertical], [disabled])) .divider {
    cursor: col-resize;
  }

  :host(:not([vertical])) .divider::after {
    display: flex;
    content: '';
    position: absolute;
    height: 100%;
    left: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    width: var(--divider-hit-area);
  }

  /* Vertical */
  :host([vertical]) {
    flex-direction: column;
  }

  :host([vertical]:not([disabled])) .divider {
    cursor: row-resize;
  }

  :host([vertical]) .divider::after {
    content: '';
    position: absolute;
    width: 100%;
    top: calc(var(--divider-hit-area) / -2 + var(--divider-width) / 2);
    height: var(--divider-hit-area);
  }

  @media (forced-colors: active) {
    .divider {
      outline: solid 1px transparent;
    }
  }
`;
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ESELY2US.js
function drag(container, options) {
  function move(pointerEvent) {
    const dims = container.getBoundingClientRect();
    const defaultView = container.ownerDocument.defaultView;
    const offsetX = dims.left + defaultView.scrollX;
    const offsetY = dims.top + defaultView.scrollY;
    const x2 = pointerEvent.pageX - offsetX;
    const y3 = pointerEvent.pageY - offsetY;
    if (options == null ? void 0 : options.onMove) {
      options.onMove(x2, y3);
    }
  }
  function stop() {
    document.removeEventListener("pointermove", move);
    document.removeEventListener("pointerup", stop);
    if (options == null ? void 0 : options.onStop) {
      options.onStop();
    }
  }
  document.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerup", stop);
  if ((options == null ? void 0 : options.initialEvent) instanceof PointerEvent) {
    move(options.initialEvent);
  }
}
var init_chunk_ESELY2US = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ESELY2US.js"() {
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.HF7GESMZ.js
function clamp(value, min2, max2) {
  const noNegativeZero = (n8) => Object.is(n8, -0) ? 0 : n8;
  if (value < min2) {
    return noNegativeZero(min2);
  }
  if (value > max2) {
    return noNegativeZero(max2);
  }
  return noNegativeZero(value);
}
var init_chunk_HF7GESMZ = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.HF7GESMZ.js"() {
  }
});

// node_modules/.pnpm/@shoelace-style+localize@3.2.1/node_modules/@shoelace-style/localize/dist/index.js
function registerTranslation(...translation2) {
  translation2.map((t6) => {
    const code = t6.$code.toLowerCase();
    if (translations.has(code)) {
      translations.set(code, Object.assign(Object.assign({}, translations.get(code)), t6));
    } else {
      translations.set(code, t6);
    }
    if (!fallback) {
      fallback = t6;
    }
  });
  update();
}
function update() {
  if (isClient) {
    documentDirection = document.documentElement.dir || "ltr";
    documentLanguage = document.documentElement.lang || navigator.language;
  }
  [...connectedElements.keys()].map((el) => {
    if (typeof el.requestUpdate === "function") {
      el.requestUpdate();
    }
  });
}
var connectedElements, translations, fallback, documentDirection, documentLanguage, isClient, LocalizeController;
var init_dist = __esm({
  "node_modules/.pnpm/@shoelace-style+localize@3.2.1/node_modules/@shoelace-style/localize/dist/index.js"() {
    connectedElements = /* @__PURE__ */ new Set();
    translations = /* @__PURE__ */ new Map();
    documentDirection = "ltr";
    documentLanguage = "en";
    isClient = typeof MutationObserver !== "undefined" && typeof document !== "undefined" && typeof document.documentElement !== "undefined";
    if (isClient) {
      const documentElementObserver = new MutationObserver(update);
      documentDirection = document.documentElement.dir || "ltr";
      documentLanguage = document.documentElement.lang || navigator.language;
      documentElementObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["dir", "lang"]
      });
    }
    LocalizeController = class {
      constructor(host) {
        this.host = host;
        this.host.addController(this);
      }
      hostConnected() {
        connectedElements.add(this.host);
      }
      hostDisconnected() {
        connectedElements.delete(this.host);
      }
      dir() {
        return `${this.host.dir || documentDirection}`.toLowerCase();
      }
      lang() {
        return `${this.host.lang || documentLanguage}`.toLowerCase();
      }
      getTranslationData(lang) {
        var _a, _b;
        const locale = new Intl.Locale(lang.replace(/_/g, "-"));
        const language = locale === null || locale === void 0 ? void 0 : locale.language.toLowerCase();
        const region = (_b = (_a = locale === null || locale === void 0 ? void 0 : locale.region) === null || _a === void 0 ? void 0 : _a.toLowerCase()) !== null && _b !== void 0 ? _b : "";
        const primary = translations.get(`${language}-${region}`);
        const secondary = translations.get(language);
        return { locale, language, region, primary, secondary };
      }
      exists(key, options) {
        var _a;
        const { primary, secondary } = this.getTranslationData((_a = options.lang) !== null && _a !== void 0 ? _a : this.lang());
        options = Object.assign({ includeFallback: false }, options);
        if (primary && primary[key] || secondary && secondary[key] || options.includeFallback && fallback && fallback[key]) {
          return true;
        }
        return false;
      }
      term(key, ...args) {
        const { primary, secondary } = this.getTranslationData(this.lang());
        let term;
        if (primary && primary[key]) {
          term = primary[key];
        } else if (secondary && secondary[key]) {
          term = secondary[key];
        } else if (fallback && fallback[key]) {
          term = fallback[key];
        } else {
          console.error(`No translation found for: ${String(key)}`);
          return String(key);
        }
        if (typeof term === "function") {
          return term(...args);
        }
        return term;
      }
      date(dateToFormat, options) {
        dateToFormat = new Date(dateToFormat);
        return new Intl.DateTimeFormat(this.lang(), options).format(dateToFormat);
      }
      number(numberToFormat, options) {
        numberToFormat = Number(numberToFormat);
        return isNaN(numberToFormat) ? "" : new Intl.NumberFormat(this.lang(), options).format(numberToFormat);
      }
      relativeTime(value, unit, options) {
        return new Intl.RelativeTimeFormat(this.lang(), options).format(value, unit);
      }
    };
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.MAS2SHYD.js
var translation, en_default;
var init_chunk_MAS2SHYD = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.MAS2SHYD.js"() {
    init_dist();
    translation = {
      $code: "en",
      $name: "English",
      $dir: "ltr",
      carousel: "Carousel",
      clearEntry: "Clear entry",
      close: "Close",
      copied: "Copied",
      copy: "Copy",
      currentValue: "Current value",
      error: "Error",
      goToSlide: (slide, count) => `Go to slide ${slide} of ${count}`,
      hidePassword: "Hide password",
      loading: "Loading",
      nextSlide: "Next slide",
      numOptionsSelected: (num) => {
        if (num === 0)
          return "No options selected";
        if (num === 1)
          return "1 option selected";
        return `${num} options selected`;
      },
      previousSlide: "Previous slide",
      progress: "Progress",
      remove: "Remove",
      resize: "Resize",
      scrollToEnd: "Scroll to end",
      scrollToStart: "Scroll to start",
      selectAColorFromTheScreen: "Select a color from the screen",
      showPassword: "Show password",
      slideNum: (slide) => `Slide ${slide}`,
      toggleColorFormat: "Toggle color format"
    };
    registerTranslation(translation);
    en_default = translation;
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.WLV3FVBR.js
var LocalizeController2;
var init_chunk_WLV3FVBR = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.WLV3FVBR.js"() {
    init_chunk_MAS2SHYD();
    init_dist();
    init_dist();
    LocalizeController2 = class extends LocalizeController {
    };
    registerTranslation(en_default);
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.CCJUT23E.js
function watch(propertyName, options) {
  const resolvedOptions = __spreadValues({
    waitUntilFirstUpdate: false
  }, options);
  return (proto, decoratedFnName) => {
    const { update: update2 } = proto;
    const watchedProperties = Array.isArray(propertyName) ? propertyName : [propertyName];
    proto.update = function(changedProps) {
      watchedProperties.forEach((property) => {
        const key = property;
        if (changedProps.has(key)) {
          const oldValue = changedProps.get(key);
          const newValue = this[key];
          if (oldValue !== newValue) {
            if (!resolvedOptions.waitUntilFirstUpdate || this.hasUpdated) {
              this[decoratedFnName](oldValue, newValue);
            }
          }
        }
      });
      update2.call(this, changedProps);
    };
  };
}
var init_chunk_CCJUT23E = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.CCJUT23E.js"() {
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.TUVJKY7S.js
var component_styles_default;
var init_chunk_TUVJKY7S = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.TUVJKY7S.js"() {
    init_lit();
    component_styles_default = i`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }
`;
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/custom-element.js
var init_custom_element = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/custom-element.js"() {
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/property.js
function n4(t6) {
  return (e10, o10) => "object" == typeof o10 ? r5(t6, e10, o10) : ((t7, e11, o11) => {
    const r9 = e11.hasOwnProperty(o11);
    return e11.constructor.createProperty(o11, r9 ? { ...t7, wrapped: true } : t7), r9 ? Object.getOwnPropertyDescriptor(e11, o11) : void 0;
  })(t6, e10, o10);
}
var o4, r5;
var init_property = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/property.js"() {
    init_reactive_element();
    o4 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
    r5 = (t6 = o4, e10, r9) => {
      const { kind: n8, metadata: i7 } = r9;
      let s4 = globalThis.litPropertyMetadata.get(i7);
      if (void 0 === s4 && globalThis.litPropertyMetadata.set(i7, s4 = /* @__PURE__ */ new Map()), s4.set(r9.name, t6), "accessor" === n8) {
        const { name: o10 } = r9;
        return { set(r10) {
          const n9 = e10.get.call(this);
          e10.set.call(this, r10), this.requestUpdate(o10, n9, t6);
        }, init(e11) {
          return void 0 !== e11 && this.P(o10, void 0, t6), e11;
        } };
      }
      if ("setter" === n8) {
        const { name: o10 } = r9;
        return function(r10) {
          const n9 = this[o10];
          e10.call(this, r10), this.requestUpdate(o10, n9, t6);
        };
      }
      throw Error("Unsupported decorator location: " + n8);
    };
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/state.js
function r6(r9) {
  return n4({ ...r9, state: true, attribute: false });
}
var init_state = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/state.js"() {
    init_property();
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/event-options.js
var init_event_options = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/event-options.js"() {
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/base.js
var e4;
var init_base = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/base.js"() {
    e4 = (e10, t6, c6) => (c6.configurable = true, c6.enumerable = true, Reflect.decorate && "object" != typeof t6 && Object.defineProperty(e10, t6, c6), c6);
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query.js
function e5(e10, r9) {
  return (n8, s4, i7) => {
    const o10 = (t6) => t6.renderRoot?.querySelector(e10) ?? null;
    if (r9) {
      const { get: e11, set: r10 } = "object" == typeof s4 ? n8 : i7 ?? (() => {
        const t6 = Symbol();
        return { get() {
          return this[t6];
        }, set(e12) {
          this[t6] = e12;
        } };
      })();
      return e4(n8, s4, { get() {
        let t6 = e11.call(this);
        return void 0 === t6 && (t6 = o10(this), (null !== t6 || this.hasUpdated) && r10.call(this, t6)), t6;
      } });
    }
    return e4(n8, s4, { get() {
      return o10(this);
    } });
  };
}
var init_query = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query.js"() {
    init_base();
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query-all.js
var init_query_all = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query-all.js"() {
    init_base();
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query-async.js
var init_query_async = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query-async.js"() {
    init_base();
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query-assigned-elements.js
var init_query_assigned_elements = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query-assigned-elements.js"() {
    init_base();
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js
var init_query_assigned_nodes = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query-assigned-nodes.js"() {
    init_base();
  }
});

// node_modules/.pnpm/lit@3.2.1/node_modules/lit/decorators.js
var init_decorators = __esm({
  "node_modules/.pnpm/lit@3.2.1/node_modules/lit/decorators.js"() {
    init_custom_element();
    init_property();
    init_state();
    init_event_options();
    init_query();
    init_query_all();
    init_query_async();
    init_query_assigned_elements();
    init_query_assigned_nodes();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.UYAO2JRR.js
var _hasRecordedInitialProperties, ShoelaceElement;
var init_chunk_UYAO2JRR = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.UYAO2JRR.js"() {
    init_chunk_B3BW2AY6();
    init_lit();
    init_decorators();
    ShoelaceElement = class extends r4 {
      constructor() {
        super();
        __privateAdd(this, _hasRecordedInitialProperties, false);
        this.initialReflectedProperties = /* @__PURE__ */ new Map();
        Object.entries(this.constructor.dependencies).forEach(([name, component]) => {
          this.constructor.define(name, component);
        });
      }
      emit(name, options) {
        const event = new CustomEvent(name, __spreadValues({
          bubbles: true,
          cancelable: false,
          composed: true,
          detail: {}
        }, options));
        this.dispatchEvent(event);
        return event;
      }
      /* eslint-enable */
      static define(name, elementConstructor = this, options = {}) {
        const currentlyRegisteredConstructor = customElements.get(name);
        if (!currentlyRegisteredConstructor) {
          try {
            customElements.define(name, elementConstructor, options);
          } catch (_err) {
            customElements.define(name, class extends elementConstructor {
            }, options);
          }
          return;
        }
        let newVersion = " (unknown version)";
        let existingVersion = newVersion;
        if ("version" in elementConstructor && elementConstructor.version) {
          newVersion = " v" + elementConstructor.version;
        }
        if ("version" in currentlyRegisteredConstructor && currentlyRegisteredConstructor.version) {
          existingVersion = " v" + currentlyRegisteredConstructor.version;
        }
        if (newVersion && existingVersion && newVersion === existingVersion) {
          return;
        }
        console.warn(
          `Attempted to register <${name}>${newVersion}, but <${name}>${existingVersion} has already been registered.`
        );
      }
      attributeChangedCallback(name, oldValue, newValue) {
        if (!__privateGet(this, _hasRecordedInitialProperties)) {
          this.constructor.elementProperties.forEach(
            (obj, prop) => {
              if (obj.reflect && this[prop] != null) {
                this.initialReflectedProperties.set(prop, this[prop]);
              }
            }
          );
          __privateSet(this, _hasRecordedInitialProperties, true);
        }
        super.attributeChangedCallback(name, oldValue, newValue);
      }
      willUpdate(changedProperties) {
        super.willUpdate(changedProperties);
        this.initialReflectedProperties.forEach((value, prop) => {
          if (changedProperties.has(prop) && this[prop] == null) {
            this[prop] = value;
          }
        });
      }
    };
    _hasRecordedInitialProperties = /* @__PURE__ */ new WeakMap();
    ShoelaceElement.version = "2.18.0";
    ShoelaceElement.dependencies = {};
    __decorateClass([
      n4()
    ], ShoelaceElement.prototype, "dir", 2);
    __decorateClass([
      n4()
    ], ShoelaceElement.prototype, "lang", 2);
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/if-defined.js
var o5;
var init_if_defined = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/if-defined.js"() {
    init_lit_html();
    o5 = (o10) => o10 ?? E;
  }
});

// node_modules/.pnpm/lit@3.2.1/node_modules/lit/directives/if-defined.js
var init_if_defined2 = __esm({
  "node_modules/.pnpm/lit@3.2.1/node_modules/lit/directives/if-defined.js"() {
    init_if_defined();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.LVQUZVFZ.js
var SlSplitPanel;
var init_chunk_LVQUZVFZ = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.LVQUZVFZ.js"() {
    init_chunk_UAYXD3AN();
    init_chunk_ESELY2US();
    init_chunk_HF7GESMZ();
    init_chunk_WLV3FVBR();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
    init_lit();
    init_if_defined2();
    init_decorators();
    SlSplitPanel = class extends ShoelaceElement {
      constructor() {
        super(...arguments);
        this.localize = new LocalizeController2(this);
        this.position = 50;
        this.vertical = false;
        this.disabled = false;
        this.snapThreshold = 12;
      }
      connectedCallback() {
        super.connectedCallback();
        this.resizeObserver = new ResizeObserver((entries) => this.handleResize(entries));
        this.updateComplete.then(() => this.resizeObserver.observe(this));
        this.detectSize();
        this.cachedPositionInPixels = this.percentageToPixels(this.position);
      }
      disconnectedCallback() {
        var _a;
        super.disconnectedCallback();
        (_a = this.resizeObserver) == null ? void 0 : _a.unobserve(this);
      }
      detectSize() {
        const { width, height } = this.getBoundingClientRect();
        this.size = this.vertical ? height : width;
      }
      percentageToPixels(value) {
        return this.size * (value / 100);
      }
      pixelsToPercentage(value) {
        return value / this.size * 100;
      }
      handleDrag(event) {
        const isRtl = this.localize.dir() === "rtl";
        if (this.disabled) {
          return;
        }
        if (event.cancelable) {
          event.preventDefault();
        }
        drag(this, {
          onMove: (x2, y3) => {
            let newPositionInPixels = this.vertical ? y3 : x2;
            if (this.primary === "end") {
              newPositionInPixels = this.size - newPositionInPixels;
            }
            if (this.snap) {
              const snaps = this.snap.split(" ");
              snaps.forEach((value) => {
                let snapPoint;
                if (value.endsWith("%")) {
                  snapPoint = this.size * (parseFloat(value) / 100);
                } else {
                  snapPoint = parseFloat(value);
                }
                if (isRtl && !this.vertical) {
                  snapPoint = this.size - snapPoint;
                }
                if (newPositionInPixels >= snapPoint - this.snapThreshold && newPositionInPixels <= snapPoint + this.snapThreshold) {
                  newPositionInPixels = snapPoint;
                }
              });
            }
            this.position = clamp(this.pixelsToPercentage(newPositionInPixels), 0, 100);
          },
          initialEvent: event
        });
      }
      handleKeyDown(event) {
        if (this.disabled) {
          return;
        }
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) {
          let newPosition = this.position;
          const incr = (event.shiftKey ? 10 : 1) * (this.primary === "end" ? -1 : 1);
          event.preventDefault();
          if (event.key === "ArrowLeft" && !this.vertical || event.key === "ArrowUp" && this.vertical) {
            newPosition -= incr;
          }
          if (event.key === "ArrowRight" && !this.vertical || event.key === "ArrowDown" && this.vertical) {
            newPosition += incr;
          }
          if (event.key === "Home") {
            newPosition = this.primary === "end" ? 100 : 0;
          }
          if (event.key === "End") {
            newPosition = this.primary === "end" ? 0 : 100;
          }
          this.position = clamp(newPosition, 0, 100);
        }
      }
      handleResize(entries) {
        const { width, height } = entries[0].contentRect;
        this.size = this.vertical ? height : width;
        if (isNaN(this.cachedPositionInPixels) || this.position === Infinity) {
          this.cachedPositionInPixels = Number(this.getAttribute("position-in-pixels"));
          this.positionInPixels = Number(this.getAttribute("position-in-pixels"));
          this.position = this.pixelsToPercentage(this.positionInPixels);
        }
        if (this.primary) {
          this.position = this.pixelsToPercentage(this.cachedPositionInPixels);
        }
      }
      handlePositionChange() {
        this.cachedPositionInPixels = this.percentageToPixels(this.position);
        this.positionInPixels = this.percentageToPixels(this.position);
        this.emit("sl-reposition");
      }
      handlePositionInPixelsChange() {
        this.position = this.pixelsToPercentage(this.positionInPixels);
      }
      handleVerticalChange() {
        this.detectSize();
      }
      render() {
        const gridTemplate = this.vertical ? "gridTemplateRows" : "gridTemplateColumns";
        const gridTemplateAlt = this.vertical ? "gridTemplateColumns" : "gridTemplateRows";
        const isRtl = this.localize.dir() === "rtl";
        const primary = `
      clamp(
        0%,
        clamp(
          var(--min),
          ${this.position}% - var(--divider-width) / 2,
          var(--max)
        ),
        calc(100% - var(--divider-width))
      )
    `;
        const secondary = "auto";
        if (this.primary === "end") {
          if (isRtl && !this.vertical) {
            this.style[gridTemplate] = `${primary} var(--divider-width) ${secondary}`;
          } else {
            this.style[gridTemplate] = `${secondary} var(--divider-width) ${primary}`;
          }
        } else {
          if (isRtl && !this.vertical) {
            this.style[gridTemplate] = `${secondary} var(--divider-width) ${primary}`;
          } else {
            this.style[gridTemplate] = `${primary} var(--divider-width) ${secondary}`;
          }
        }
        this.style[gridTemplateAlt] = "";
        return x`
      <slot name="start" part="panel start" class="start"></slot>

      <div
        part="divider"
        class="divider"
        tabindex=${o5(this.disabled ? void 0 : "0")}
        role="separator"
        aria-valuenow=${this.position}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label=${this.localize.term("resize")}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleDrag}
        @touchstart=${this.handleDrag}
      >
        <slot name="divider"></slot>
      </div>

      <slot name="end" part="panel end" class="end"></slot>
    `;
      }
    };
    SlSplitPanel.styles = [component_styles_default, split_panel_styles_default];
    __decorateClass([
      e5(".divider")
    ], SlSplitPanel.prototype, "divider", 2);
    __decorateClass([
      n4({ type: Number, reflect: true })
    ], SlSplitPanel.prototype, "position", 2);
    __decorateClass([
      n4({ attribute: "position-in-pixels", type: Number })
    ], SlSplitPanel.prototype, "positionInPixels", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlSplitPanel.prototype, "vertical", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlSplitPanel.prototype, "disabled", 2);
    __decorateClass([
      n4()
    ], SlSplitPanel.prototype, "primary", 2);
    __decorateClass([
      n4()
    ], SlSplitPanel.prototype, "snap", 2);
    __decorateClass([
      n4({ type: Number, attribute: "snap-threshold" })
    ], SlSplitPanel.prototype, "snapThreshold", 2);
    __decorateClass([
      watch("position")
    ], SlSplitPanel.prototype, "handlePositionChange", 1);
    __decorateClass([
      watch("positionInPixels")
    ], SlSplitPanel.prototype, "handlePositionInPixelsChange", 1);
    __decorateClass([
      watch("vertical")
    ], SlSplitPanel.prototype, "handleVerticalChange", 1);
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.VNDG2HB5.js
var init_chunk_VNDG2HB5 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.VNDG2HB5.js"() {
    init_chunk_LVQUZVFZ();
    SlSplitPanel.define("sl-split-panel");
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/split-panel/split-panel.js
var init_split_panel = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/split-panel/split-panel.js"() {
    init_chunk_VNDG2HB5();
    init_chunk_LVQUZVFZ();
    init_chunk_UAYXD3AN();
    init_chunk_ESELY2US();
    init_chunk_HF7GESMZ();
    init_chunk_WLV3FVBR();
    init_chunk_MAS2SHYD();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.7DUCI5S4.js
var spinner_styles_default;
var init_chunk_7DUCI5S4 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.7DUCI5S4.js"() {
    init_lit();
    spinner_styles_default = i`
  :host {
    --track-width: 2px;
    --track-color: rgb(128 128 128 / 25%);
    --indicator-color: var(--sl-color-primary-600);
    --speed: 2s;

    display: inline-flex;
    width: 1em;
    height: 1em;
    flex: none;
  }

  .spinner {
    flex: 1 1 auto;
    height: 100%;
    width: 100%;
  }

  .spinner__track,
  .spinner__indicator {
    fill: none;
    stroke-width: var(--track-width);
    r: calc(0.5em - var(--track-width) / 2);
    cx: 0.5em;
    cy: 0.5em;
    transform-origin: 50% 50%;
  }

  .spinner__track {
    stroke: var(--track-color);
    transform-origin: 0% 0%;
  }

  .spinner__indicator {
    stroke: var(--indicator-color);
    stroke-linecap: round;
    stroke-dasharray: 150% 75%;
    animation: spin var(--speed) linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
      stroke-dasharray: 0.05em, 3em;
    }

    50% {
      transform: rotate(450deg);
      stroke-dasharray: 1.375em, 1.375em;
    }

    100% {
      transform: rotate(1080deg);
      stroke-dasharray: 0.05em, 3em;
    }
  }
`;
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.TLKDQ5JG.js
var SlSpinner;
var init_chunk_TLKDQ5JG = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.TLKDQ5JG.js"() {
    init_chunk_7DUCI5S4();
    init_chunk_WLV3FVBR();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_lit();
    SlSpinner = class extends ShoelaceElement {
      constructor() {
        super(...arguments);
        this.localize = new LocalizeController2(this);
      }
      render() {
        return x`
      <svg part="base" class="spinner" role="progressbar" aria-label=${this.localize.term("loading")}>
        <circle class="spinner__track"></circle>
        <circle class="spinner__indicator"></circle>
      </svg>
    `;
      }
    };
    SlSpinner.styles = [component_styles_default, spinner_styles_default];
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.EHUQAWJK.js
var init_chunk_EHUQAWJK = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.EHUQAWJK.js"() {
    init_chunk_TLKDQ5JG();
    SlSpinner.define("sl-spinner");
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/spinner/spinner.js
var init_spinner = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/spinner/spinner.js"() {
    init_chunk_EHUQAWJK();
    init_chunk_TLKDQ5JG();
    init_chunk_7DUCI5S4();
    init_chunk_WLV3FVBR();
    init_chunk_MAS2SHYD();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.WQC6OWUE.js
var badge_styles_default;
var init_chunk_WQC6OWUE = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.WQC6OWUE.js"() {
    init_lit();
    badge_styles_default = i`
  :host {
    display: inline-flex;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, 0.75em);
    font-weight: var(--sl-font-weight-semibold);
    letter-spacing: var(--sl-letter-spacing-normal);
    line-height: 1;
    border-radius: var(--sl-border-radius-small);
    border: solid 1px var(--sl-color-neutral-0);
    white-space: nowrap;
    padding: 0.35em 0.6em;
    user-select: none;
    -webkit-user-select: none;
    cursor: inherit;
  }

  /* Variant modifiers */
  .badge--primary {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--success {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--neutral {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--warning {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .badge--danger {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--sl-border-radius-pill);
  }

  /* Pulse modifier */
  .badge--pulse {
    animation: pulse 1.5s infinite;
  }

  .badge--pulse.badge--primary {
    --pulse-color: var(--sl-color-primary-600);
  }

  .badge--pulse.badge--success {
    --pulse-color: var(--sl-color-success-600);
  }

  .badge--pulse.badge--neutral {
    --pulse-color: var(--sl-color-neutral-600);
  }

  .badge--pulse.badge--warning {
    --pulse-color: var(--sl-color-warning-600);
  }

  .badge--pulse.badge--danger {
    --pulse-color: var(--sl-color-danger-600);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 var(--pulse-color);
    }
    70% {
      box-shadow: 0 0 0 0.5rem transparent;
    }
    100% {
      box-shadow: 0 0 0 0 transparent;
    }
  }
`;
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directive.js
var t3, e6, i5;
var init_directive = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directive.js"() {
    t3 = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
    e6 = (t6) => (...e10) => ({ _$litDirective$: t6, values: e10 });
    i5 = class {
      constructor(t6) {
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AT(t6, e10, i7) {
        this._$Ct = t6, this._$AM = e10, this._$Ci = i7;
      }
      _$AS(t6, e10) {
        return this.update(t6, e10);
      }
      update(t6, e10) {
        return this.render(...e10);
      }
    };
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/class-map.js
var e7;
var init_class_map = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/class-map.js"() {
    init_lit_html();
    init_directive();
    e7 = e6(class extends i5 {
      constructor(t6) {
        if (super(t6), t6.type !== t3.ATTRIBUTE || "class" !== t6.name || t6.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
      }
      render(t6) {
        return " " + Object.keys(t6).filter((s4) => t6[s4]).join(" ") + " ";
      }
      update(s4, [i7]) {
        if (void 0 === this.st) {
          this.st = /* @__PURE__ */ new Set(), void 0 !== s4.strings && (this.nt = new Set(s4.strings.join(" ").split(/\s/).filter((t6) => "" !== t6)));
          for (const t6 in i7) i7[t6] && !this.nt?.has(t6) && this.st.add(t6);
          return this.render(i7);
        }
        const r9 = s4.element.classList;
        for (const t6 of this.st) t6 in i7 || (r9.remove(t6), this.st.delete(t6));
        for (const t6 in i7) {
          const s5 = !!i7[t6];
          s5 === this.st.has(t6) || this.nt?.has(t6) || (s5 ? (r9.add(t6), this.st.add(t6)) : (r9.remove(t6), this.st.delete(t6)));
        }
        return T;
      }
    });
  }
});

// node_modules/.pnpm/lit@3.2.1/node_modules/lit/directives/class-map.js
var init_class_map2 = __esm({
  "node_modules/.pnpm/lit@3.2.1/node_modules/lit/directives/class-map.js"() {
    init_class_map();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.IY7ZNK2P.js
var SlBadge;
var init_chunk_IY7ZNK2P = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.IY7ZNK2P.js"() {
    init_chunk_WQC6OWUE();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
    init_class_map2();
    init_lit();
    init_decorators();
    SlBadge = class extends ShoelaceElement {
      constructor() {
        super(...arguments);
        this.variant = "primary";
        this.pill = false;
        this.pulse = false;
      }
      render() {
        return x`
      <span
        part="base"
        class=${e7({
          badge: true,
          "badge--primary": this.variant === "primary",
          "badge--success": this.variant === "success",
          "badge--neutral": this.variant === "neutral",
          "badge--warning": this.variant === "warning",
          "badge--danger": this.variant === "danger",
          "badge--pill": this.pill,
          "badge--pulse": this.pulse
        })}
        role="status"
      >
        <slot></slot>
      </span>
    `;
      }
    };
    SlBadge.styles = [component_styles_default, badge_styles_default];
    __decorateClass([
      n4({ reflect: true })
    ], SlBadge.prototype, "variant", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlBadge.prototype, "pill", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlBadge.prototype, "pulse", 2);
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.DMOR2FWQ.js
var init_chunk_DMOR2FWQ = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.DMOR2FWQ.js"() {
    init_chunk_IY7ZNK2P();
    SlBadge.define("sl-badge");
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/badge/badge.js
var init_badge = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/badge/badge.js"() {
    init_chunk_DMOR2FWQ();
    init_chunk_IY7ZNK2P();
    init_chunk_WQC6OWUE();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.J7PLVEQM.js
var details_styles_default;
var init_chunk_J7PLVEQM = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.J7PLVEQM.js"() {
    init_lit();
    details_styles_default = i`
  :host {
    display: block;
  }

  .details {
    border: solid 1px var(--sl-color-neutral-200);
    border-radius: var(--sl-border-radius-medium);
    background-color: var(--sl-color-neutral-0);
    overflow-anchor: none;
  }

  .details--disabled {
    opacity: 0.5;
  }

  .details__header {
    display: flex;
    align-items: center;
    border-radius: inherit;
    padding: var(--sl-spacing-medium);
    user-select: none;
    -webkit-user-select: none;
    cursor: pointer;
  }

  .details__header::-webkit-details-marker {
    display: none;
  }

  .details__header:focus {
    outline: none;
  }

  .details__header:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: calc(1px + var(--sl-focus-ring-offset));
  }

  .details--disabled .details__header {
    cursor: not-allowed;
  }

  .details--disabled .details__header:focus-visible {
    outline: none;
    box-shadow: none;
  }

  .details__summary {
    flex: 1 1 auto;
    display: flex;
    align-items: center;
  }

  .details__summary-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    transition: var(--sl-transition-medium) rotate ease;
  }

  .details--open .details__summary-icon {
    rotate: 90deg;
  }

  .details--open.details--rtl .details__summary-icon {
    rotate: -90deg;
  }

  .details--open slot[name='expand-icon'],
  .details:not(.details--open) slot[name='collapse-icon'] {
    display: none;
  }

  .details__body {
    overflow: hidden;
  }

  .details__content {
    display: block;
    padding: var(--sl-spacing-medium);
  }
`;
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.UW6SLYOK.js
function ensureAnimation(animation) {
  return animation != null ? animation : { keyframes: [], options: { duration: 0 } };
}
function getLogicalAnimation(animation, dir) {
  if (dir.toLowerCase() === "rtl") {
    return {
      keyframes: animation.rtlKeyframes || animation.keyframes,
      options: animation.options
    };
  }
  return animation;
}
function setDefaultAnimation(animationName, animation) {
  defaultAnimationRegistry.set(animationName, ensureAnimation(animation));
}
function getAnimation(el, animationName, options) {
  const customAnimation = customAnimationRegistry.get(el);
  if (customAnimation == null ? void 0 : customAnimation[animationName]) {
    return getLogicalAnimation(customAnimation[animationName], options.dir);
  }
  const defaultAnimation = defaultAnimationRegistry.get(animationName);
  if (defaultAnimation) {
    return getLogicalAnimation(defaultAnimation, options.dir);
  }
  return {
    keyframes: [],
    options: { duration: 0 }
  };
}
var defaultAnimationRegistry, customAnimationRegistry;
var init_chunk_UW6SLYOK = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.UW6SLYOK.js"() {
    init_chunk_B3BW2AY6();
    defaultAnimationRegistry = /* @__PURE__ */ new Map();
    customAnimationRegistry = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.B4BZKR24.js
function waitForEvent(el, eventName) {
  return new Promise((resolve) => {
    function done(event) {
      if (event.target === el) {
        el.removeEventListener(eventName, done);
        resolve();
      }
    }
    el.addEventListener(eventName, done);
  });
}
var init_chunk_B4BZKR24 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.B4BZKR24.js"() {
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3EPZX5HE.js
function animateTo(el, keyframes, options) {
  return new Promise((resolve) => {
    if ((options == null ? void 0 : options.duration) === Infinity) {
      throw new Error("Promise-based animations must be finite.");
    }
    const animation = el.animate(keyframes, __spreadProps(__spreadValues({}, options), {
      duration: prefersReducedMotion() ? 0 : options.duration
    }));
    animation.addEventListener("cancel", resolve, { once: true });
    animation.addEventListener("finish", resolve, { once: true });
  });
}
function prefersReducedMotion() {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  return query.matches;
}
function stopAnimations(el) {
  return Promise.all(
    el.getAnimations().map((animation) => {
      return new Promise((resolve) => {
        animation.cancel();
        requestAnimationFrame(resolve);
      });
    })
  );
}
function shimKeyframesHeightAuto(keyframes, calculatedHeight) {
  return keyframes.map((keyframe) => __spreadProps(__spreadValues({}, keyframe), {
    height: keyframe.height === "auto" ? `${calculatedHeight}px` : keyframe.height
  }));
}
var init_chunk_3EPZX5HE = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3EPZX5HE.js"() {
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.P7ZG6EMR.js
var library, library_default_default;
var init_chunk_P7ZG6EMR = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.P7ZG6EMR.js"() {
    init_chunk_3Y6SB6QS();
    library = {
      name: "default",
      resolver: (name) => getBasePath(`assets/icons/${name}.svg`)
    };
    library_default_default = library;
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3TFKS637.js
var icons, systemLibrary, library_system_default;
var init_chunk_3TFKS637 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3TFKS637.js"() {
    icons = {
      caret: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,
      check: `
    <svg part="checked-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor">
          <g transform="translate(3.428571, 3.428571)">
            <path d="M0,5.71428571 L3.42857143,9.14285714"></path>
            <path d="M9.14285714,0 L3.42857143,9.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
      "chevron-down": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
      "chevron-left": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-left" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
    </svg>
  `,
      "chevron-right": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
    </svg>
  `,
      copy: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-copy" viewBox="0 0 16 16">
      <path fill-rule="evenodd" d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V2Zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H6ZM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1H2Z"/>
    </svg>
  `,
      eye: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye" viewBox="0 0 16 16">
      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/>
    </svg>
  `,
      "eye-slash": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eye-slash" viewBox="0 0 16 16">
      <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709z"/>
      <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829z"/>
      <path d="M3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
    </svg>
  `,
      eyedropper: `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-eyedropper" viewBox="0 0 16 16">
      <path d="M13.354.646a1.207 1.207 0 0 0-1.708 0L8.5 3.793l-.646-.647a.5.5 0 1 0-.708.708L8.293 5l-7.147 7.146A.5.5 0 0 0 1 12.5v1.793l-.854.853a.5.5 0 1 0 .708.707L1.707 15H3.5a.5.5 0 0 0 .354-.146L11 7.707l1.146 1.147a.5.5 0 0 0 .708-.708l-.647-.646 3.147-3.146a1.207 1.207 0 0 0 0-1.708l-2-2zM2 12.707l7-7L10.293 7l-7 7H2v-1.293z"></path>
    </svg>
  `,
      "grip-vertical": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-grip-vertical" viewBox="0 0 16 16">
      <path d="M7 2a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 5a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zM7 8a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm-3 3a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm3 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"></path>
    </svg>
  `,
      indeterminate: `
    <svg part="indeterminate-icon" class="checkbox__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" stroke-linecap="round">
        <g stroke="currentColor" stroke-width="2">
          <g transform="translate(2.285714, 6.857143)">
            <path d="M10.2857143,1.14285714 L1.14285714,1.14285714"></path>
          </g>
        </g>
      </g>
    </svg>
  `,
      "person-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-person-fill" viewBox="0 0 16 16">
      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
    </svg>
  `,
      "play-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16">
      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"></path>
    </svg>
  `,
      "pause-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
      <path d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5zm5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5z"></path>
    </svg>
  `,
      radio: `
    <svg part="checked-icon" class="radio__icon" viewBox="0 0 16 16">
      <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g fill="currentColor">
          <circle cx="8" cy="8" r="3.42857143"></circle>
        </g>
      </g>
    </svg>
  `,
      "star-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
    </svg>
  `,
      "x-lg": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-lg" viewBox="0 0 16 16">
      <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z"/>
    </svg>
  `,
      "x-circle-fill": `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
    </svg>
  `
    };
    systemLibrary = {
      name: "system",
      resolver: (name) => {
        if (name in icons) {
          return `data:image/svg+xml,${encodeURIComponent(icons[name])}`;
        }
        return "";
      }
    };
    library_system_default = systemLibrary;
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ZL53POKZ.js
function watchIcon(icon) {
  watchedIcons.push(icon);
}
function unwatchIcon(icon) {
  watchedIcons = watchedIcons.filter((el) => el !== icon);
}
function getIconLibrary(name) {
  return registry.find((lib) => lib.name === name);
}
var registry, watchedIcons;
var init_chunk_ZL53POKZ = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ZL53POKZ.js"() {
    init_chunk_P7ZG6EMR();
    init_chunk_3TFKS637();
    registry = [library_default_default, library_system_default];
    watchedIcons = [];
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.QLXRCYS4.js
var icon_styles_default;
var init_chunk_QLXRCYS4 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.QLXRCYS4.js"() {
    init_lit();
    icon_styles_default = i`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }
`;
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directive-helpers.js
var t4, e8, f3;
var init_directive_helpers = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directive-helpers.js"() {
    init_lit_html();
    ({ I: t4 } = Z);
    e8 = (o10, t6) => void 0 === t6 ? void 0 !== o10?._$litType$ : o10?._$litType$ === t6;
    f3 = (o10) => void 0 === o10.strings;
  }
});

// node_modules/.pnpm/lit@3.2.1/node_modules/lit/directive-helpers.js
var init_directive_helpers2 = __esm({
  "node_modules/.pnpm/lit@3.2.1/node_modules/lit/directive-helpers.js"() {
    init_directive_helpers();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.E6QAPUBK.js
var CACHEABLE_ERROR, RETRYABLE_ERROR, parser, iconCache, SlIcon;
var init_chunk_E6QAPUBK = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.E6QAPUBK.js"() {
    init_chunk_ZL53POKZ();
    init_chunk_QLXRCYS4();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
    init_lit();
    init_directive_helpers2();
    init_decorators();
    CACHEABLE_ERROR = Symbol();
    RETRYABLE_ERROR = Symbol();
    iconCache = /* @__PURE__ */ new Map();
    SlIcon = class extends ShoelaceElement {
      constructor() {
        super(...arguments);
        this.initialRender = false;
        this.svg = null;
        this.label = "";
        this.library = "default";
      }
      /** Given a URL, this function returns the resulting SVG element or an appropriate error symbol. */
      async resolveIcon(url, library2) {
        var _a;
        let fileData;
        if (library2 == null ? void 0 : library2.spriteSheet) {
          this.svg = x`<svg part="svg">
        <use part="use" href="${url}"></use>
      </svg>`;
          return this.svg;
        }
        try {
          fileData = await fetch(url, { mode: "cors" });
          if (!fileData.ok)
            return fileData.status === 410 ? CACHEABLE_ERROR : RETRYABLE_ERROR;
        } catch (e10) {
          return RETRYABLE_ERROR;
        }
        try {
          const div = document.createElement("div");
          div.innerHTML = await fileData.text();
          const svg = div.firstElementChild;
          if (((_a = svg == null ? void 0 : svg.tagName) == null ? void 0 : _a.toLowerCase()) !== "svg")
            return CACHEABLE_ERROR;
          if (!parser)
            parser = new DOMParser();
          const doc = parser.parseFromString(svg.outerHTML, "text/html");
          const svgEl = doc.body.querySelector("svg");
          if (!svgEl)
            return CACHEABLE_ERROR;
          svgEl.part.add("svg");
          return document.adoptNode(svgEl);
        } catch (e10) {
          return CACHEABLE_ERROR;
        }
      }
      connectedCallback() {
        super.connectedCallback();
        watchIcon(this);
      }
      firstUpdated() {
        this.initialRender = true;
        this.setIcon();
      }
      disconnectedCallback() {
        super.disconnectedCallback();
        unwatchIcon(this);
      }
      getIconSource() {
        const library2 = getIconLibrary(this.library);
        if (this.name && library2) {
          return {
            url: library2.resolver(this.name),
            fromLibrary: true
          };
        }
        return {
          url: this.src,
          fromLibrary: false
        };
      }
      handleLabelChange() {
        const hasLabel = typeof this.label === "string" && this.label.length > 0;
        if (hasLabel) {
          this.setAttribute("role", "img");
          this.setAttribute("aria-label", this.label);
          this.removeAttribute("aria-hidden");
        } else {
          this.removeAttribute("role");
          this.removeAttribute("aria-label");
          this.setAttribute("aria-hidden", "true");
        }
      }
      async setIcon() {
        var _a;
        const { url, fromLibrary } = this.getIconSource();
        const library2 = fromLibrary ? getIconLibrary(this.library) : void 0;
        if (!url) {
          this.svg = null;
          return;
        }
        let iconResolver = iconCache.get(url);
        if (!iconResolver) {
          iconResolver = this.resolveIcon(url, library2);
          iconCache.set(url, iconResolver);
        }
        if (!this.initialRender) {
          return;
        }
        const svg = await iconResolver;
        if (svg === RETRYABLE_ERROR) {
          iconCache.delete(url);
        }
        if (url !== this.getIconSource().url) {
          return;
        }
        if (e8(svg)) {
          this.svg = svg;
          if (library2) {
            await this.updateComplete;
            const shadowSVG = this.shadowRoot.querySelector("[part='svg']");
            if (typeof library2.mutator === "function" && shadowSVG) {
              library2.mutator(shadowSVG);
            }
          }
          return;
        }
        switch (svg) {
          case RETRYABLE_ERROR:
          case CACHEABLE_ERROR:
            this.svg = null;
            this.emit("sl-error");
            break;
          default:
            this.svg = svg.cloneNode(true);
            (_a = library2 == null ? void 0 : library2.mutator) == null ? void 0 : _a.call(library2, this.svg);
            this.emit("sl-load");
        }
      }
      render() {
        return this.svg;
      }
    };
    SlIcon.styles = [component_styles_default, icon_styles_default];
    __decorateClass([
      r6()
    ], SlIcon.prototype, "svg", 2);
    __decorateClass([
      n4({ reflect: true })
    ], SlIcon.prototype, "name", 2);
    __decorateClass([
      n4()
    ], SlIcon.prototype, "src", 2);
    __decorateClass([
      n4()
    ], SlIcon.prototype, "label", 2);
    __decorateClass([
      n4({ reflect: true })
    ], SlIcon.prototype, "library", 2);
    __decorateClass([
      watch("label")
    ], SlIcon.prototype, "handleLabelChange", 1);
    __decorateClass([
      watch(["name", "src", "library"])
    ], SlIcon.prototype, "setIcon", 1);
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.K7Q3XHLX.js
var SlDetails;
var init_chunk_K7Q3XHLX = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.K7Q3XHLX.js"() {
    init_chunk_J7PLVEQM();
    init_chunk_UW6SLYOK();
    init_chunk_B4BZKR24();
    init_chunk_3EPZX5HE();
    init_chunk_WLV3FVBR();
    init_chunk_E6QAPUBK();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
    init_class_map2();
    init_lit();
    init_decorators();
    SlDetails = class extends ShoelaceElement {
      constructor() {
        super(...arguments);
        this.localize = new LocalizeController2(this);
        this.open = false;
        this.disabled = false;
      }
      firstUpdated() {
        this.body.style.height = this.open ? "auto" : "0";
        if (this.open) {
          this.details.open = true;
        }
        this.detailsObserver = new MutationObserver((changes) => {
          for (const change of changes) {
            if (change.type === "attributes" && change.attributeName === "open") {
              if (this.details.open) {
                this.show();
              } else {
                this.hide();
              }
            }
          }
        });
        this.detailsObserver.observe(this.details, { attributes: true });
      }
      disconnectedCallback() {
        var _a;
        super.disconnectedCallback();
        (_a = this.detailsObserver) == null ? void 0 : _a.disconnect();
      }
      handleSummaryClick(event) {
        event.preventDefault();
        if (!this.disabled) {
          if (this.open) {
            this.hide();
          } else {
            this.show();
          }
          this.header.focus();
        }
      }
      handleSummaryKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (this.open) {
            this.hide();
          } else {
            this.show();
          }
        }
        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
          event.preventDefault();
          this.hide();
        }
        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
          event.preventDefault();
          this.show();
        }
      }
      async handleOpenChange() {
        if (this.open) {
          this.details.open = true;
          const slShow = this.emit("sl-show", { cancelable: true });
          if (slShow.defaultPrevented) {
            this.open = false;
            this.details.open = false;
            return;
          }
          await stopAnimations(this.body);
          const { keyframes, options } = getAnimation(this, "details.show", { dir: this.localize.dir() });
          await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
          this.body.style.height = "auto";
          this.emit("sl-after-show");
        } else {
          const slHide = this.emit("sl-hide", { cancelable: true });
          if (slHide.defaultPrevented) {
            this.details.open = true;
            this.open = true;
            return;
          }
          await stopAnimations(this.body);
          const { keyframes, options } = getAnimation(this, "details.hide", { dir: this.localize.dir() });
          await animateTo(this.body, shimKeyframesHeightAuto(keyframes, this.body.scrollHeight), options);
          this.body.style.height = "auto";
          this.details.open = false;
          this.emit("sl-after-hide");
        }
      }
      /** Shows the details. */
      async show() {
        if (this.open || this.disabled) {
          return void 0;
        }
        this.open = true;
        return waitForEvent(this, "sl-after-show");
      }
      /** Hides the details */
      async hide() {
        if (!this.open || this.disabled) {
          return void 0;
        }
        this.open = false;
        return waitForEvent(this, "sl-after-hide");
      }
      render() {
        const isRtl = this.localize.dir() === "rtl";
        return x`
      <details
        part="base"
        class=${e7({
          details: true,
          "details--open": this.open,
          "details--disabled": this.disabled,
          "details--rtl": isRtl
        })}
      >
        <summary
          part="header"
          id="header"
          class="details__header"
          role="button"
          aria-expanded=${this.open ? "true" : "false"}
          aria-controls="content"
          aria-disabled=${this.disabled ? "true" : "false"}
          tabindex=${this.disabled ? "-1" : "0"}
          @click=${this.handleSummaryClick}
          @keydown=${this.handleSummaryKeyDown}
        >
          <slot name="summary" part="summary" class="details__summary">${this.summary}</slot>

          <span part="summary-icon" class="details__summary-icon">
            <slot name="expand-icon">
              <sl-icon library="system" name=${isRtl ? "chevron-left" : "chevron-right"}></sl-icon>
            </slot>
            <slot name="collapse-icon">
              <sl-icon library="system" name=${isRtl ? "chevron-left" : "chevron-right"}></sl-icon>
            </slot>
          </span>
        </summary>

        <div class="details__body" role="region" aria-labelledby="header">
          <slot part="content" id="content" class="details__content"></slot>
        </div>
      </details>
    `;
      }
    };
    SlDetails.styles = [component_styles_default, details_styles_default];
    SlDetails.dependencies = {
      "sl-icon": SlIcon
    };
    __decorateClass([
      e5(".details")
    ], SlDetails.prototype, "details", 2);
    __decorateClass([
      e5(".details__header")
    ], SlDetails.prototype, "header", 2);
    __decorateClass([
      e5(".details__body")
    ], SlDetails.prototype, "body", 2);
    __decorateClass([
      e5(".details__expand-icon-slot")
    ], SlDetails.prototype, "expandIconSlot", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlDetails.prototype, "open", 2);
    __decorateClass([
      n4()
    ], SlDetails.prototype, "summary", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlDetails.prototype, "disabled", 2);
    __decorateClass([
      watch("open", { waitUntilFirstUpdate: true })
    ], SlDetails.prototype, "handleOpenChange", 1);
    setDefaultAnimation("details.show", {
      keyframes: [
        { height: "0", opacity: "0" },
        { height: "auto", opacity: "1" }
      ],
      options: { duration: 250, easing: "linear" }
    });
    setDefaultAnimation("details.hide", {
      keyframes: [
        { height: "auto", opacity: "1" },
        { height: "0", opacity: "0" }
      ],
      options: { duration: 250, easing: "linear" }
    });
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.LWS7GFRM.js
var init_chunk_LWS7GFRM = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.LWS7GFRM.js"() {
    init_chunk_K7Q3XHLX();
    SlDetails.define("sl-details");
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/details/details.js
var init_details = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/details/details.js"() {
    init_chunk_LWS7GFRM();
    init_chunk_K7Q3XHLX();
    init_chunk_J7PLVEQM();
    init_chunk_UW6SLYOK();
    init_chunk_B4BZKR24();
    init_chunk_3EPZX5HE();
    init_chunk_WLV3FVBR();
    init_chunk_MAS2SHYD();
    init_chunk_E6QAPUBK();
    init_chunk_ZL53POKZ();
    init_chunk_P7ZG6EMR();
    init_chunk_3TFKS637();
    init_chunk_QLXRCYS4();
    init_chunk_3Y6SB6QS();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.LXP7GVU3.js
var dropdown_styles_default;
var init_chunk_LXP7GVU3 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.LXP7GVU3.js"() {
    init_lit();
    dropdown_styles_default = i`
  :host {
    display: inline-block;
  }

  .dropdown::part(popup) {
    z-index: var(--sl-z-index-dropdown);
  }

  .dropdown[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .dropdown[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .dropdown[data-current-placement^='left']::part(popup) {
    transform-origin: right;
  }

  .dropdown[data-current-placement^='right']::part(popup) {
    transform-origin: left;
  }

  .dropdown__trigger {
    display: block;
  }

  .dropdown__panel {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    box-shadow: var(--sl-shadow-large);
    border-radius: var(--sl-border-radius-medium);
    pointer-events: none;
  }

  .dropdown--open .dropdown__panel {
    display: block;
    pointer-events: all;
  }

  /* When users slot a menu, make sure it conforms to the popup's auto-size */
  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.LXDTFLWU.js
function getCachedComputedStyle(el) {
  let computedStyle = computedStyleMap.get(el);
  if (!computedStyle) {
    computedStyle = window.getComputedStyle(el, null);
    computedStyleMap.set(el, computedStyle);
  }
  return computedStyle;
}
function isVisible(el) {
  if (typeof el.checkVisibility === "function") {
    return el.checkVisibility({ checkOpacity: false, checkVisibilityCSS: true });
  }
  const computedStyle = getCachedComputedStyle(el);
  return computedStyle.visibility !== "hidden" && computedStyle.display !== "none";
}
function isOverflowingAndTabbable(el) {
  const computedStyle = getCachedComputedStyle(el);
  const { overflowY, overflowX } = computedStyle;
  if (overflowY === "scroll" || overflowX === "scroll") {
    return true;
  }
  if (overflowY !== "auto" || overflowX !== "auto") {
    return false;
  }
  const isOverflowingY = el.scrollHeight > el.clientHeight;
  if (isOverflowingY && overflowY === "auto") {
    return true;
  }
  const isOverflowingX = el.scrollWidth > el.clientWidth;
  if (isOverflowingX && overflowX === "auto") {
    return true;
  }
  return false;
}
function isTabbable(el) {
  const tag = el.tagName.toLowerCase();
  const tabindex = Number(el.getAttribute("tabindex"));
  const hasTabindex = el.hasAttribute("tabindex");
  if (hasTabindex && (isNaN(tabindex) || tabindex <= -1)) {
    return false;
  }
  if (el.hasAttribute("disabled")) {
    return false;
  }
  if (el.closest("[inert]")) {
    return false;
  }
  if (tag === "input" && el.getAttribute("type") === "radio" && !el.hasAttribute("checked")) {
    return false;
  }
  if (!isVisible(el)) {
    return false;
  }
  if ((tag === "audio" || tag === "video") && el.hasAttribute("controls")) {
    return true;
  }
  if (el.hasAttribute("tabindex")) {
    return true;
  }
  if (el.hasAttribute("contenteditable") && el.getAttribute("contenteditable") !== "false") {
    return true;
  }
  const isNativelyTabbable = [
    "button",
    "input",
    "select",
    "textarea",
    "a",
    "audio",
    "video",
    "summary",
    "iframe"
  ].includes(tag);
  if (isNativelyTabbable) {
    return true;
  }
  return isOverflowingAndTabbable(el);
}
function getTabbableBoundary(root) {
  var _a, _b;
  const tabbableElements = getTabbableElements(root);
  const start = (_a = tabbableElements[0]) != null ? _a : null;
  const end = (_b = tabbableElements[tabbableElements.length - 1]) != null ? _b : null;
  return { start, end };
}
function getSlottedChildrenOutsideRootElement(slotElement, root) {
  var _a;
  return ((_a = slotElement.getRootNode({ composed: true })) == null ? void 0 : _a.host) !== root;
}
function getTabbableElements(root) {
  const walkedEls = /* @__PURE__ */ new WeakMap();
  const tabbableElements = [];
  function walk(el) {
    if (el instanceof Element) {
      if (el.hasAttribute("inert") || el.closest("[inert]")) {
        return;
      }
      if (walkedEls.has(el)) {
        return;
      }
      walkedEls.set(el, true);
      if (!tabbableElements.includes(el) && isTabbable(el)) {
        tabbableElements.push(el);
      }
      if (el instanceof HTMLSlotElement && getSlottedChildrenOutsideRootElement(el, root)) {
        el.assignedElements({ flatten: true }).forEach((assignedEl) => {
          walk(assignedEl);
        });
      }
      if (el.shadowRoot !== null && el.shadowRoot.mode === "open") {
        walk(el.shadowRoot);
      }
    }
    for (const e10 of el.children) {
      walk(e10);
    }
  }
  walk(root);
  return tabbableElements.sort((a4, b3) => {
    const aTabindex = Number(a4.getAttribute("tabindex")) || 0;
    const bTabindex = Number(b3.getAttribute("tabindex")) || 0;
    return bTabindex - aTabindex;
  });
}
var computedStyleMap;
var init_chunk_LXDTFLWU = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.LXDTFLWU.js"() {
    computedStyleMap = /* @__PURE__ */ new WeakMap();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3KSWVBQ5.js
var popup_styles_default;
var init_chunk_3KSWVBQ5 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.3KSWVBQ5.js"() {
    init_lit();
    popup_styles_default = i`
  :host {
    --arrow-color: var(--sl-color-neutral-1000);
    --arrow-size: 6px;

    /*
     * These properties are computed to account for the arrow's dimensions after being rotated 45º. The constant
     * 0.7071 is derived from sin(45), which is the diagonal size of the arrow's container after rotating.
     */
    --arrow-size-diagonal: calc(var(--arrow-size) * 0.7071);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: calc(var(--arrow-size-diagonal) * 2);
    height: calc(var(--arrow-size-diagonal) * 2);
    rotate: 45deg;
    background: var(--arrow-color);
    z-index: -1;
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`;
  }
});

// node_modules/.pnpm/@floating-ui+utils@0.2.8/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs
function clamp2(start, value, end) {
  return max(start, min(value, end));
}
function evaluate(value, param) {
  return typeof value === "function" ? value(param) : value;
}
function getSide(placement) {
  return placement.split("-")[0];
}
function getAlignment(placement) {
  return placement.split("-")[1];
}
function getOppositeAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function getAxisLength(axis) {
  return axis === "y" ? "height" : "width";
}
function getSideAxis(placement) {
  return ["top", "bottom"].includes(getSide(placement)) ? "y" : "x";
}
function getAlignmentAxis(placement) {
  return getOppositeAxis(getSideAxis(placement));
}
function getAlignmentSides(placement, rects, rtl) {
  if (rtl === void 0) {
    rtl = false;
  }
  const alignment = getAlignment(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const length = getAxisLength(alignmentAxis);
  let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
  if (rects.reference[length] > rects.floating[length]) {
    mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
  }
  return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
}
function getExpandedPlacements(placement) {
  const oppositePlacement = getOppositePlacement(placement);
  return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
}
function getOppositeAlignmentPlacement(placement) {
  return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
}
function getSideList(side, isStart, rtl) {
  const lr = ["left", "right"];
  const rl = ["right", "left"];
  const tb = ["top", "bottom"];
  const bt = ["bottom", "top"];
  switch (side) {
    case "top":
    case "bottom":
      if (rtl) return isStart ? rl : lr;
      return isStart ? lr : rl;
    case "left":
    case "right":
      return isStart ? tb : bt;
    default:
      return [];
  }
}
function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
  const alignment = getAlignment(placement);
  let list = getSideList(getSide(placement), direction === "start", rtl);
  if (alignment) {
    list = list.map((side) => side + "-" + alignment);
    if (flipAlignment) {
      list = list.concat(list.map(getOppositeAlignmentPlacement));
    }
  }
  return list;
}
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
}
function expandPaddingObject(padding) {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    ...padding
  };
}
function getPaddingObject(padding) {
  return typeof padding !== "number" ? expandPaddingObject(padding) : {
    top: padding,
    right: padding,
    bottom: padding,
    left: padding
  };
}
function rectToClientRect(rect) {
  const {
    x: x2,
    y: y3,
    width,
    height
  } = rect;
  return {
    width,
    height,
    top: y3,
    left: x2,
    right: x2 + width,
    bottom: y3 + height,
    x: x2,
    y: y3
  };
}
var min, max, round, floor, createCoords, oppositeSideMap, oppositeAlignmentMap;
var init_floating_ui_utils = __esm({
  "node_modules/.pnpm/@floating-ui+utils@0.2.8/node_modules/@floating-ui/utils/dist/floating-ui.utils.mjs"() {
    min = Math.min;
    max = Math.max;
    round = Math.round;
    floor = Math.floor;
    createCoords = (v2) => ({
      x: v2,
      y: v2
    });
    oppositeSideMap = {
      left: "right",
      right: "left",
      bottom: "top",
      top: "bottom"
    };
    oppositeAlignmentMap = {
      start: "end",
      end: "start"
    };
  }
});

// node_modules/.pnpm/@floating-ui+core@1.6.8/node_modules/@floating-ui/core/dist/floating-ui.core.mjs
function computeCoordsFromPlacement(_ref, placement, rtl) {
  let {
    reference,
    floating
  } = _ref;
  const sideAxis = getSideAxis(placement);
  const alignmentAxis = getAlignmentAxis(placement);
  const alignLength = getAxisLength(alignmentAxis);
  const side = getSide(placement);
  const isVertical = sideAxis === "y";
  const commonX = reference.x + reference.width / 2 - floating.width / 2;
  const commonY = reference.y + reference.height / 2 - floating.height / 2;
  const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
  let coords;
  switch (side) {
    case "top":
      coords = {
        x: commonX,
        y: reference.y - floating.height
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.y + reference.height
      };
      break;
    case "right":
      coords = {
        x: reference.x + reference.width,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: reference.x - floating.width,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (getAlignment(placement)) {
    case "start":
      coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
      break;
    case "end":
      coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
      break;
  }
  return coords;
}
async function detectOverflow(state, options) {
  var _await$platform$isEle;
  if (options === void 0) {
    options = {};
  }
  const {
    x: x2,
    y: y3,
    platform: platform2,
    rects,
    elements,
    strategy
  } = state;
  const {
    boundary = "clippingAncestors",
    rootBoundary = "viewport",
    elementContext = "floating",
    altBoundary = false,
    padding = 0
  } = evaluate(options, state);
  const paddingObject = getPaddingObject(padding);
  const altContext = elementContext === "floating" ? "reference" : "floating";
  const element = elements[altBoundary ? altContext : elementContext];
  const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
    element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
    boundary,
    rootBoundary,
    strategy
  }));
  const rect = elementContext === "floating" ? {
    x: x2,
    y: y3,
    width: rects.floating.width,
    height: rects.floating.height
  } : rects.reference;
  const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
  const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
    x: 1,
    y: 1
  } : {
    x: 1,
    y: 1
  };
  const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
    elements,
    rect,
    offsetParent,
    strategy
  }) : rect);
  return {
    top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
    bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
    left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
    right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
  };
}
async function convertValueToCoords(state, options) {
  const {
    placement,
    platform: platform2,
    elements
  } = state;
  const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
  const side = getSide(placement);
  const alignment = getAlignment(placement);
  const isVertical = getSideAxis(placement) === "y";
  const mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1;
  const crossAxisMulti = rtl && isVertical ? -1 : 1;
  const rawValue = evaluate(options, state);
  let {
    mainAxis,
    crossAxis,
    alignmentAxis
  } = typeof rawValue === "number" ? {
    mainAxis: rawValue,
    crossAxis: 0,
    alignmentAxis: null
  } : {
    mainAxis: rawValue.mainAxis || 0,
    crossAxis: rawValue.crossAxis || 0,
    alignmentAxis: rawValue.alignmentAxis
  };
  if (alignment && typeof alignmentAxis === "number") {
    crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
  }
  return isVertical ? {
    x: crossAxis * crossAxisMulti,
    y: mainAxis * mainAxisMulti
  } : {
    x: mainAxis * mainAxisMulti,
    y: crossAxis * crossAxisMulti
  };
}
var computePosition, arrow, flip, offset, shift, size;
var init_floating_ui_core = __esm({
  "node_modules/.pnpm/@floating-ui+core@1.6.8/node_modules/@floating-ui/core/dist/floating-ui.core.mjs"() {
    init_floating_ui_utils();
    init_floating_ui_utils();
    computePosition = async (reference, floating, config) => {
      const {
        placement = "bottom",
        strategy = "absolute",
        middleware = [],
        platform: platform2
      } = config;
      const validMiddleware = middleware.filter(Boolean);
      const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
      let rects = await platform2.getElementRects({
        reference,
        floating,
        strategy
      });
      let {
        x: x2,
        y: y3
      } = computeCoordsFromPlacement(rects, placement, rtl);
      let statefulPlacement = placement;
      let middlewareData = {};
      let resetCount = 0;
      for (let i7 = 0; i7 < validMiddleware.length; i7++) {
        const {
          name,
          fn
        } = validMiddleware[i7];
        const {
          x: nextX,
          y: nextY,
          data,
          reset
        } = await fn({
          x: x2,
          y: y3,
          initialPlacement: placement,
          placement: statefulPlacement,
          strategy,
          middlewareData,
          rects,
          platform: platform2,
          elements: {
            reference,
            floating
          }
        });
        x2 = nextX != null ? nextX : x2;
        y3 = nextY != null ? nextY : y3;
        middlewareData = {
          ...middlewareData,
          [name]: {
            ...middlewareData[name],
            ...data
          }
        };
        if (reset && resetCount <= 50) {
          resetCount++;
          if (typeof reset === "object") {
            if (reset.placement) {
              statefulPlacement = reset.placement;
            }
            if (reset.rects) {
              rects = reset.rects === true ? await platform2.getElementRects({
                reference,
                floating,
                strategy
              }) : reset.rects;
            }
            ({
              x: x2,
              y: y3
            } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
          }
          i7 = -1;
        }
      }
      return {
        x: x2,
        y: y3,
        placement: statefulPlacement,
        strategy,
        middlewareData
      };
    };
    arrow = (options) => ({
      name: "arrow",
      options,
      async fn(state) {
        const {
          x: x2,
          y: y3,
          placement,
          rects,
          platform: platform2,
          elements,
          middlewareData
        } = state;
        const {
          element,
          padding = 0
        } = evaluate(options, state) || {};
        if (element == null) {
          return {};
        }
        const paddingObject = getPaddingObject(padding);
        const coords = {
          x: x2,
          y: y3
        };
        const axis = getAlignmentAxis(placement);
        const length = getAxisLength(axis);
        const arrowDimensions = await platform2.getDimensions(element);
        const isYAxis = axis === "y";
        const minProp = isYAxis ? "top" : "left";
        const maxProp = isYAxis ? "bottom" : "right";
        const clientProp = isYAxis ? "clientHeight" : "clientWidth";
        const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
        const startDiff = coords[axis] - rects.reference[axis];
        const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
        let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
        if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
          clientSize = elements.floating[clientProp] || rects.floating[length];
        }
        const centerToReference = endDiff / 2 - startDiff / 2;
        const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
        const minPadding = min(paddingObject[minProp], largestPossiblePadding);
        const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
        const min$1 = minPadding;
        const max2 = clientSize - arrowDimensions[length] - maxPadding;
        const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
        const offset3 = clamp2(min$1, center, max2);
        const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset3 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
        const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
        return {
          [axis]: coords[axis] + alignmentOffset,
          data: {
            [axis]: offset3,
            centerOffset: center - offset3 - alignmentOffset,
            ...shouldAddOffset && {
              alignmentOffset
            }
          },
          reset: shouldAddOffset
        };
      }
    });
    flip = function(options) {
      if (options === void 0) {
        options = {};
      }
      return {
        name: "flip",
        options,
        async fn(state) {
          var _middlewareData$arrow, _middlewareData$flip;
          const {
            placement,
            middlewareData,
            rects,
            initialPlacement,
            platform: platform2,
            elements
          } = state;
          const {
            mainAxis: checkMainAxis = true,
            crossAxis: checkCrossAxis = true,
            fallbackPlacements: specifiedFallbackPlacements,
            fallbackStrategy = "bestFit",
            fallbackAxisSideDirection = "none",
            flipAlignment = true,
            ...detectOverflowOptions
          } = evaluate(options, state);
          if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
            return {};
          }
          const side = getSide(placement);
          const initialSideAxis = getSideAxis(initialPlacement);
          const isBasePlacement = getSide(initialPlacement) === initialPlacement;
          const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
          const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
          const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
          if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
            fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
          }
          const placements2 = [initialPlacement, ...fallbackPlacements];
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const overflows = [];
          let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
          if (checkMainAxis) {
            overflows.push(overflow[side]);
          }
          if (checkCrossAxis) {
            const sides2 = getAlignmentSides(placement, rects, rtl);
            overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
          }
          overflowsData = [...overflowsData, {
            placement,
            overflows
          }];
          if (!overflows.every((side2) => side2 <= 0)) {
            var _middlewareData$flip2, _overflowsData$filter;
            const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
            const nextPlacement = placements2[nextIndex];
            if (nextPlacement) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
            let resetPlacement = (_overflowsData$filter = overflowsData.filter((d3) => d3.overflows[0] <= 0).sort((a4, b3) => a4.overflows[1] - b3.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
            if (!resetPlacement) {
              switch (fallbackStrategy) {
                case "bestFit": {
                  var _overflowsData$filter2;
                  const placement2 = (_overflowsData$filter2 = overflowsData.filter((d3) => {
                    if (hasFallbackAxisSideDirection) {
                      const currentSideAxis = getSideAxis(d3.placement);
                      return currentSideAxis === initialSideAxis || // Create a bias to the `y` side axis due to horizontal
                      // reading directions favoring greater width.
                      currentSideAxis === "y";
                    }
                    return true;
                  }).map((d3) => [d3.placement, d3.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a4, b3) => a4[1] - b3[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                  if (placement2) {
                    resetPlacement = placement2;
                  }
                  break;
                }
                case "initialPlacement":
                  resetPlacement = initialPlacement;
                  break;
              }
            }
            if (placement !== resetPlacement) {
              return {
                reset: {
                  placement: resetPlacement
                }
              };
            }
          }
          return {};
        }
      };
    };
    offset = function(options) {
      if (options === void 0) {
        options = 0;
      }
      return {
        name: "offset",
        options,
        async fn(state) {
          var _middlewareData$offse, _middlewareData$arrow;
          const {
            x: x2,
            y: y3,
            placement,
            middlewareData
          } = state;
          const diffCoords = await convertValueToCoords(state, options);
          if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
            return {};
          }
          return {
            x: x2 + diffCoords.x,
            y: y3 + diffCoords.y,
            data: {
              ...diffCoords,
              placement
            }
          };
        }
      };
    };
    shift = function(options) {
      if (options === void 0) {
        options = {};
      }
      return {
        name: "shift",
        options,
        async fn(state) {
          const {
            x: x2,
            y: y3,
            placement
          } = state;
          const {
            mainAxis: checkMainAxis = true,
            crossAxis: checkCrossAxis = false,
            limiter = {
              fn: (_ref) => {
                let {
                  x: x3,
                  y: y4
                } = _ref;
                return {
                  x: x3,
                  y: y4
                };
              }
            },
            ...detectOverflowOptions
          } = evaluate(options, state);
          const coords = {
            x: x2,
            y: y3
          };
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const crossAxis = getSideAxis(getSide(placement));
          const mainAxis = getOppositeAxis(crossAxis);
          let mainAxisCoord = coords[mainAxis];
          let crossAxisCoord = coords[crossAxis];
          if (checkMainAxis) {
            const minSide = mainAxis === "y" ? "top" : "left";
            const maxSide = mainAxis === "y" ? "bottom" : "right";
            const min2 = mainAxisCoord + overflow[minSide];
            const max2 = mainAxisCoord - overflow[maxSide];
            mainAxisCoord = clamp2(min2, mainAxisCoord, max2);
          }
          if (checkCrossAxis) {
            const minSide = crossAxis === "y" ? "top" : "left";
            const maxSide = crossAxis === "y" ? "bottom" : "right";
            const min2 = crossAxisCoord + overflow[minSide];
            const max2 = crossAxisCoord - overflow[maxSide];
            crossAxisCoord = clamp2(min2, crossAxisCoord, max2);
          }
          const limitedCoords = limiter.fn({
            ...state,
            [mainAxis]: mainAxisCoord,
            [crossAxis]: crossAxisCoord
          });
          return {
            ...limitedCoords,
            data: {
              x: limitedCoords.x - x2,
              y: limitedCoords.y - y3,
              enabled: {
                [mainAxis]: checkMainAxis,
                [crossAxis]: checkCrossAxis
              }
            }
          };
        }
      };
    };
    size = function(options) {
      if (options === void 0) {
        options = {};
      }
      return {
        name: "size",
        options,
        async fn(state) {
          var _state$middlewareData, _state$middlewareData2;
          const {
            placement,
            rects,
            platform: platform2,
            elements
          } = state;
          const {
            apply = () => {
            },
            ...detectOverflowOptions
          } = evaluate(options, state);
          const overflow = await detectOverflow(state, detectOverflowOptions);
          const side = getSide(placement);
          const alignment = getAlignment(placement);
          const isYAxis = getSideAxis(placement) === "y";
          const {
            width,
            height
          } = rects.floating;
          let heightSide;
          let widthSide;
          if (side === "top" || side === "bottom") {
            heightSide = side;
            widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
          } else {
            widthSide = side;
            heightSide = alignment === "end" ? "top" : "bottom";
          }
          const maximumClippingHeight = height - overflow.top - overflow.bottom;
          const maximumClippingWidth = width - overflow.left - overflow.right;
          const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
          const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
          const noShift = !state.middlewareData.shift;
          let availableHeight = overflowAvailableHeight;
          let availableWidth = overflowAvailableWidth;
          if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
            availableWidth = maximumClippingWidth;
          }
          if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
            availableHeight = maximumClippingHeight;
          }
          if (noShift && !alignment) {
            const xMin = max(overflow.left, 0);
            const xMax = max(overflow.right, 0);
            const yMin = max(overflow.top, 0);
            const yMax = max(overflow.bottom, 0);
            if (isYAxis) {
              availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
            } else {
              availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
            }
          }
          await apply({
            ...state,
            availableWidth,
            availableHeight
          });
          const nextDimensions = await platform2.getDimensions(elements.floating);
          if (width !== nextDimensions.width || height !== nextDimensions.height) {
            return {
              reset: {
                rects: true
              }
            };
          }
          return {};
        }
      };
    };
  }
});

// node_modules/.pnpm/@floating-ui+utils@0.2.8/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs
function hasWindow() {
  return typeof window !== "undefined";
}
function getNodeName(node) {
  if (isNode(node)) {
    return (node.nodeName || "").toLowerCase();
  }
  return "#document";
}
function getWindow(node) {
  var _node$ownerDocument;
  return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
}
function getDocumentElement(node) {
  var _ref;
  return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
}
function isNode(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Node || value instanceof getWindow(value).Node;
}
function isElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof Element || value instanceof getWindow(value).Element;
}
function isHTMLElement(value) {
  if (!hasWindow()) {
    return false;
  }
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
}
function isShadowRoot(value) {
  if (!hasWindow() || typeof ShadowRoot === "undefined") {
    return false;
  }
  return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
}
function isOverflowElement(element) {
  const {
    overflow,
    overflowX,
    overflowY,
    display
  } = getComputedStyle2(element);
  return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !["inline", "contents"].includes(display);
}
function isTableElement(element) {
  return ["table", "td", "th"].includes(getNodeName(element));
}
function isTopLayer(element) {
  return [":popover-open", ":modal"].some((selector) => {
    try {
      return element.matches(selector);
    } catch (e10) {
      return false;
    }
  });
}
function isContainingBlock(elementOrCss) {
  const webkit = isWebKit();
  const css = isElement(elementOrCss) ? getComputedStyle2(elementOrCss) : elementOrCss;
  return css.transform !== "none" || css.perspective !== "none" || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || ["transform", "perspective", "filter"].some((value) => (css.willChange || "").includes(value)) || ["paint", "layout", "strict", "content"].some((value) => (css.contain || "").includes(value));
}
function getContainingBlock(element) {
  let currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
    if (isContainingBlock(currentNode)) {
      return currentNode;
    } else if (isTopLayer(currentNode)) {
      return null;
    }
    currentNode = getParentNode(currentNode);
  }
  return null;
}
function isWebKit() {
  if (typeof CSS === "undefined" || !CSS.supports) return false;
  return CSS.supports("-webkit-backdrop-filter", "none");
}
function isLastTraversableNode(node) {
  return ["html", "body", "#document"].includes(getNodeName(node));
}
function getComputedStyle2(element) {
  return getWindow(element).getComputedStyle(element);
}
function getNodeScroll(element) {
  if (isElement(element)) {
    return {
      scrollLeft: element.scrollLeft,
      scrollTop: element.scrollTop
    };
  }
  return {
    scrollLeft: element.scrollX,
    scrollTop: element.scrollY
  };
}
function getParentNode(node) {
  if (getNodeName(node) === "html") {
    return node;
  }
  const result = (
    // Step into the shadow DOM of the parent of a slotted node.
    node.assignedSlot || // DOM Element detected.
    node.parentNode || // ShadowRoot detected.
    isShadowRoot(node) && node.host || // Fallback.
    getDocumentElement(node)
  );
  return isShadowRoot(result) ? result.host : result;
}
function getNearestOverflowAncestor(node) {
  const parentNode = getParentNode(node);
  if (isLastTraversableNode(parentNode)) {
    return node.ownerDocument ? node.ownerDocument.body : node.body;
  }
  if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
    return parentNode;
  }
  return getNearestOverflowAncestor(parentNode);
}
function getOverflowAncestors(node, list, traverseIframes) {
  var _node$ownerDocument2;
  if (list === void 0) {
    list = [];
  }
  if (traverseIframes === void 0) {
    traverseIframes = true;
  }
  const scrollableAncestor = getNearestOverflowAncestor(node);
  const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
  const win = getWindow(scrollableAncestor);
  if (isBody) {
    const frameElement = getFrameElement(win);
    return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
  }
  return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
}
function getFrameElement(win) {
  return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
}
var init_floating_ui_utils_dom = __esm({
  "node_modules/.pnpm/@floating-ui+utils@0.2.8/node_modules/@floating-ui/utils/dist/floating-ui.utils.dom.mjs"() {
  }
});

// node_modules/.pnpm/@floating-ui+dom@1.6.12/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs
function getCssDimensions(element) {
  const css = getComputedStyle2(element);
  let width = parseFloat(css.width) || 0;
  let height = parseFloat(css.height) || 0;
  const hasOffset = isHTMLElement(element);
  const offsetWidth = hasOffset ? element.offsetWidth : width;
  const offsetHeight = hasOffset ? element.offsetHeight : height;
  const shouldFallback = round(width) !== offsetWidth || round(height) !== offsetHeight;
  if (shouldFallback) {
    width = offsetWidth;
    height = offsetHeight;
  }
  return {
    width,
    height,
    $: shouldFallback
  };
}
function unwrapElement(element) {
  return !isElement(element) ? element.contextElement : element;
}
function getScale(element) {
  const domElement = unwrapElement(element);
  if (!isHTMLElement(domElement)) {
    return createCoords(1);
  }
  const rect = domElement.getBoundingClientRect();
  const {
    width,
    height,
    $: $3
  } = getCssDimensions(domElement);
  let x2 = ($3 ? round(rect.width) : rect.width) / width;
  let y3 = ($3 ? round(rect.height) : rect.height) / height;
  if (!x2 || !Number.isFinite(x2)) {
    x2 = 1;
  }
  if (!y3 || !Number.isFinite(y3)) {
    y3 = 1;
  }
  return {
    x: x2,
    y: y3
  };
}
function getVisualOffsets(element) {
  const win = getWindow(element);
  if (!isWebKit() || !win.visualViewport) {
    return noOffsets;
  }
  return {
    x: win.visualViewport.offsetLeft,
    y: win.visualViewport.offsetTop
  };
}
function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
    return false;
  }
  return isFixed;
}
function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  if (isFixedStrategy === void 0) {
    isFixedStrategy = false;
  }
  const clientRect = element.getBoundingClientRect();
  const domElement = unwrapElement(element);
  let scale = createCoords(1);
  if (includeScale) {
    if (offsetParent) {
      if (isElement(offsetParent)) {
        scale = getScale(offsetParent);
      }
    } else {
      scale = getScale(element);
    }
  }
  const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
  let x2 = (clientRect.left + visualOffsets.x) / scale.x;
  let y3 = (clientRect.top + visualOffsets.y) / scale.y;
  let width = clientRect.width / scale.x;
  let height = clientRect.height / scale.y;
  if (domElement) {
    const win = getWindow(domElement);
    const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
    let currentWin = win;
    let currentIFrame = getFrameElement(currentWin);
    while (currentIFrame && offsetParent && offsetWin !== currentWin) {
      const iframeScale = getScale(currentIFrame);
      const iframeRect = currentIFrame.getBoundingClientRect();
      const css = getComputedStyle2(currentIFrame);
      const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
      const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
      x2 *= iframeScale.x;
      y3 *= iframeScale.y;
      width *= iframeScale.x;
      height *= iframeScale.y;
      x2 += left;
      y3 += top;
      currentWin = getWindow(currentIFrame);
      currentIFrame = getFrameElement(currentWin);
    }
  }
  return rectToClientRect({
    width,
    height,
    x: x2,
    y: y3
  });
}
function getWindowScrollBarX(element, rect) {
  const leftScroll = getNodeScroll(element).scrollLeft;
  if (!rect) {
    return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
  }
  return rect.left + leftScroll;
}
function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
  if (ignoreScrollbarX === void 0) {
    ignoreScrollbarX = false;
  }
  const htmlRect = documentElement.getBoundingClientRect();
  const x2 = htmlRect.left + scroll.scrollLeft - (ignoreScrollbarX ? 0 : (
    // RTL <body> scrollbar.
    getWindowScrollBarX(documentElement, htmlRect)
  ));
  const y3 = htmlRect.top + scroll.scrollTop;
  return {
    x: x2,
    y: y3
  };
}
function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
  let {
    elements,
    rect,
    offsetParent,
    strategy
  } = _ref;
  const isFixed = strategy === "fixed";
  const documentElement = getDocumentElement(offsetParent);
  const topLayer = elements ? isTopLayer(elements.floating) : false;
  if (offsetParent === documentElement || topLayer && isFixed) {
    return rect;
  }
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  let scale = createCoords(1);
  const offsets = createCoords(0);
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      const offsetRect = getBoundingClientRect(offsetParent);
      scale = getScale(offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll, true) : createCoords(0);
  return {
    width: rect.width * scale.x,
    height: rect.height * scale.y,
    x: rect.x * scale.x - scroll.scrollLeft * scale.x + offsets.x + htmlOffset.x,
    y: rect.y * scale.y - scroll.scrollTop * scale.y + offsets.y + htmlOffset.y
  };
}
function getClientRects(element) {
  return Array.from(element.getClientRects());
}
function getDocumentRect(element) {
  const html = getDocumentElement(element);
  const scroll = getNodeScroll(element);
  const body = element.ownerDocument.body;
  const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
  const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
  let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
  const y3 = -scroll.scrollTop;
  if (getComputedStyle2(body).direction === "rtl") {
    x2 += max(html.clientWidth, body.clientWidth) - width;
  }
  return {
    width,
    height,
    x: x2,
    y: y3
  };
}
function getViewportRect(element, strategy) {
  const win = getWindow(element);
  const html = getDocumentElement(element);
  const visualViewport = win.visualViewport;
  let width = html.clientWidth;
  let height = html.clientHeight;
  let x2 = 0;
  let y3 = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    const visualViewportBased = isWebKit();
    if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
      x2 = visualViewport.offsetLeft;
      y3 = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x2,
    y: y3
  };
}
function getInnerBoundingClientRect(element, strategy) {
  const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
  const top = clientRect.top + element.clientTop;
  const left = clientRect.left + element.clientLeft;
  const scale = isHTMLElement(element) ? getScale(element) : createCoords(1);
  const width = element.clientWidth * scale.x;
  const height = element.clientHeight * scale.y;
  const x2 = left * scale.x;
  const y3 = top * scale.y;
  return {
    width,
    height,
    x: x2,
    y: y3
  };
}
function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
  let rect;
  if (clippingAncestor === "viewport") {
    rect = getViewportRect(element, strategy);
  } else if (clippingAncestor === "document") {
    rect = getDocumentRect(getDocumentElement(element));
  } else if (isElement(clippingAncestor)) {
    rect = getInnerBoundingClientRect(clippingAncestor, strategy);
  } else {
    const visualOffsets = getVisualOffsets(element);
    rect = {
      x: clippingAncestor.x - visualOffsets.x,
      y: clippingAncestor.y - visualOffsets.y,
      width: clippingAncestor.width,
      height: clippingAncestor.height
    };
  }
  return rectToClientRect(rect);
}
function hasFixedPositionAncestor(element, stopNode) {
  const parentNode = getParentNode(element);
  if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
    return false;
  }
  return getComputedStyle2(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
}
function getClippingElementAncestors(element, cache) {
  const cachedResult = cache.get(element);
  if (cachedResult) {
    return cachedResult;
  }
  let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
  let currentContainingBlockComputedStyle = null;
  const elementIsFixed = getComputedStyle2(element).position === "fixed";
  let currentNode = elementIsFixed ? getParentNode(element) : element;
  while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
    const computedStyle = getComputedStyle2(currentNode);
    const currentNodeIsContaining = isContainingBlock(currentNode);
    if (!currentNodeIsContaining && computedStyle.position === "fixed") {
      currentContainingBlockComputedStyle = null;
    }
    const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && ["absolute", "fixed"].includes(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
    if (shouldDropCurrentNode) {
      result = result.filter((ancestor) => ancestor !== currentNode);
    } else {
      currentContainingBlockComputedStyle = computedStyle;
    }
    currentNode = getParentNode(currentNode);
  }
  cache.set(element, result);
  return result;
}
function getClippingRect(_ref) {
  let {
    element,
    boundary,
    rootBoundary,
    strategy
  } = _ref;
  const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
  const clippingAncestors = [...elementClippingAncestors, rootBoundary];
  const firstClippingAncestor = clippingAncestors[0];
  const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
    const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
    accRect.top = max(rect.top, accRect.top);
    accRect.right = min(rect.right, accRect.right);
    accRect.bottom = min(rect.bottom, accRect.bottom);
    accRect.left = max(rect.left, accRect.left);
    return accRect;
  }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
  return {
    width: clippingRect.right - clippingRect.left,
    height: clippingRect.bottom - clippingRect.top,
    x: clippingRect.left,
    y: clippingRect.top
  };
}
function getDimensions(element) {
  const {
    width,
    height
  } = getCssDimensions(element);
  return {
    width,
    height
  };
}
function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
  const isOffsetParentAnElement = isHTMLElement(offsetParent);
  const documentElement = getDocumentElement(offsetParent);
  const isFixed = strategy === "fixed";
  const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
  let scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  const offsets = createCoords(0);
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isOffsetParentAnElement) {
      const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
      offsets.x = offsetRect.x + offsetParent.clientLeft;
      offsets.y = offsetRect.y + offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
  const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
  const y3 = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
  return {
    x: x2,
    y: y3,
    width: rect.width,
    height: rect.height
  };
}
function isStaticPositioned(element) {
  return getComputedStyle2(element).position === "static";
}
function getTrueOffsetParent(element, polyfill) {
  if (!isHTMLElement(element) || getComputedStyle2(element).position === "fixed") {
    return null;
  }
  if (polyfill) {
    return polyfill(element);
  }
  let rawOffsetParent = element.offsetParent;
  if (getDocumentElement(element) === rawOffsetParent) {
    rawOffsetParent = rawOffsetParent.ownerDocument.body;
  }
  return rawOffsetParent;
}
function getOffsetParent(element, polyfill) {
  const win = getWindow(element);
  if (isTopLayer(element)) {
    return win;
  }
  if (!isHTMLElement(element)) {
    let svgOffsetParent = getParentNode(element);
    while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
      if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
        return svgOffsetParent;
      }
      svgOffsetParent = getParentNode(svgOffsetParent);
    }
    return win;
  }
  let offsetParent = getTrueOffsetParent(element, polyfill);
  while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
    offsetParent = getTrueOffsetParent(offsetParent, polyfill);
  }
  if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
    return win;
  }
  return offsetParent || getContainingBlock(element) || win;
}
function isRTL(element) {
  return getComputedStyle2(element).direction === "rtl";
}
function observeMove(element, onMove) {
  let io = null;
  let timeoutId;
  const root = getDocumentElement(element);
  function cleanup() {
    var _io;
    clearTimeout(timeoutId);
    (_io = io) == null || _io.disconnect();
    io = null;
  }
  function refresh(skip, threshold) {
    if (skip === void 0) {
      skip = false;
    }
    if (threshold === void 0) {
      threshold = 1;
    }
    cleanup();
    const {
      left,
      top,
      width,
      height
    } = element.getBoundingClientRect();
    if (!skip) {
      onMove();
    }
    if (!width || !height) {
      return;
    }
    const insetTop = floor(top);
    const insetRight = floor(root.clientWidth - (left + width));
    const insetBottom = floor(root.clientHeight - (top + height));
    const insetLeft = floor(left);
    const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
    const options = {
      rootMargin,
      threshold: max(0, min(1, threshold)) || 1
    };
    let isFirstUpdate = true;
    function handleObserve(entries) {
      const ratio = entries[0].intersectionRatio;
      if (ratio !== threshold) {
        if (!isFirstUpdate) {
          return refresh();
        }
        if (!ratio) {
          timeoutId = setTimeout(() => {
            refresh(false, 1e-7);
          }, 1e3);
        } else {
          refresh(false, ratio);
        }
      }
      isFirstUpdate = false;
    }
    try {
      io = new IntersectionObserver(handleObserve, {
        ...options,
        // Handle <iframe>s
        root: root.ownerDocument
      });
    } catch (e10) {
      io = new IntersectionObserver(handleObserve, options);
    }
    io.observe(element);
  }
  refresh(true);
  return cleanup;
}
function autoUpdate(reference, floating, update2, options) {
  if (options === void 0) {
    options = {};
  }
  const {
    ancestorScroll = true,
    ancestorResize = true,
    elementResize = typeof ResizeObserver === "function",
    layoutShift = typeof IntersectionObserver === "function",
    animationFrame = false
  } = options;
  const referenceEl = unwrapElement(reference);
  const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
  ancestors.forEach((ancestor) => {
    ancestorScroll && ancestor.addEventListener("scroll", update2, {
      passive: true
    });
    ancestorResize && ancestor.addEventListener("resize", update2);
  });
  const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update2) : null;
  let reobserveFrame = -1;
  let resizeObserver = null;
  if (elementResize) {
    resizeObserver = new ResizeObserver((_ref) => {
      let [firstEntry] = _ref;
      if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
        resizeObserver.unobserve(floating);
        cancelAnimationFrame(reobserveFrame);
        reobserveFrame = requestAnimationFrame(() => {
          var _resizeObserver;
          (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
        });
      }
      update2();
    });
    if (referenceEl && !animationFrame) {
      resizeObserver.observe(referenceEl);
    }
    resizeObserver.observe(floating);
  }
  let frameId;
  let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
  if (animationFrame) {
    frameLoop();
  }
  function frameLoop() {
    const nextRefRect = getBoundingClientRect(reference);
    if (prevRefRect && (nextRefRect.x !== prevRefRect.x || nextRefRect.y !== prevRefRect.y || nextRefRect.width !== prevRefRect.width || nextRefRect.height !== prevRefRect.height)) {
      update2();
    }
    prevRefRect = nextRefRect;
    frameId = requestAnimationFrame(frameLoop);
  }
  update2();
  return () => {
    var _resizeObserver2;
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.removeEventListener("scroll", update2);
      ancestorResize && ancestor.removeEventListener("resize", update2);
    });
    cleanupIo == null || cleanupIo();
    (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
    resizeObserver = null;
    if (animationFrame) {
      cancelAnimationFrame(frameId);
    }
  };
}
var noOffsets, getElementRects, platform, offset2, shift2, flip2, size2, arrow2, computePosition2;
var init_floating_ui_dom = __esm({
  "node_modules/.pnpm/@floating-ui+dom@1.6.12/node_modules/@floating-ui/dom/dist/floating-ui.dom.mjs"() {
    init_floating_ui_core();
    init_floating_ui_utils();
    init_floating_ui_utils_dom();
    noOffsets = /* @__PURE__ */ createCoords(0);
    getElementRects = async function(data) {
      const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
      const getDimensionsFn = this.getDimensions;
      const floatingDimensions = await getDimensionsFn(data.floating);
      return {
        reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
        floating: {
          x: 0,
          y: 0,
          width: floatingDimensions.width,
          height: floatingDimensions.height
        }
      };
    };
    platform = {
      convertOffsetParentRelativeRectToViewportRelativeRect,
      getDocumentElement,
      getClippingRect,
      getOffsetParent,
      getElementRects,
      getClientRects,
      getDimensions,
      getScale,
      isElement,
      isRTL
    };
    offset2 = offset;
    shift2 = shift;
    flip2 = flip;
    size2 = size;
    arrow2 = arrow;
    computePosition2 = (reference, floating, options) => {
      const cache = /* @__PURE__ */ new Map();
      const mergedOptions = {
        platform,
        ...options
      };
      const platformWithCache = {
        ...mergedOptions.platform,
        _c: cache
      };
      return computePosition(reference, floating, {
        ...mergedOptions,
        platform: platformWithCache
      });
    };
  }
});

// node_modules/.pnpm/composed-offset-position@0.0.4/node_modules/composed-offset-position/dist/composed-offset-position.browser.min.mjs
function t5(t6) {
  return r7(t6);
}
function o6(t6) {
  return t6.assignedSlot ? t6.assignedSlot : t6.parentNode instanceof ShadowRoot ? t6.parentNode.host : t6.parentNode;
}
function r7(t6) {
  for (let e10 = t6; e10; e10 = o6(e10)) if (e10 instanceof Element && "none" === getComputedStyle(e10).display) return null;
  for (let e10 = o6(t6); e10; e10 = o6(e10)) {
    if (!(e10 instanceof Element)) continue;
    const t7 = getComputedStyle(e10);
    if ("contents" !== t7.display) {
      if ("static" !== t7.position || "none" !== t7.filter) return e10;
      if ("BODY" === e10.tagName) return e10;
    }
  }
  return null;
}
var init_composed_offset_position_browser_min = __esm({
  "node_modules/.pnpm/composed-offset-position@0.0.4/node_modules/composed-offset-position/dist/composed-offset-position.browser.min.mjs"() {
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.5J7BMMD5.js
function isVirtualElement(e10) {
  return e10 !== null && typeof e10 === "object" && "getBoundingClientRect" in e10 && ("contextElement" in e10 ? e10 instanceof Element : true);
}
var SlPopup;
var init_chunk_5J7BMMD5 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.5J7BMMD5.js"() {
    init_chunk_3KSWVBQ5();
    init_chunk_WLV3FVBR();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
    init_floating_ui_dom();
    init_class_map2();
    init_lit();
    init_composed_offset_position_browser_min();
    init_decorators();
    SlPopup = class extends ShoelaceElement {
      constructor() {
        super(...arguments);
        this.localize = new LocalizeController2(this);
        this.active = false;
        this.placement = "top";
        this.strategy = "absolute";
        this.distance = 0;
        this.skidding = 0;
        this.arrow = false;
        this.arrowPlacement = "anchor";
        this.arrowPadding = 10;
        this.flip = false;
        this.flipFallbackPlacements = "";
        this.flipFallbackStrategy = "best-fit";
        this.flipPadding = 0;
        this.shift = false;
        this.shiftPadding = 0;
        this.autoSizePadding = 0;
        this.hoverBridge = false;
        this.updateHoverBridge = () => {
          if (this.hoverBridge && this.anchorEl) {
            const anchorRect = this.anchorEl.getBoundingClientRect();
            const popupRect = this.popup.getBoundingClientRect();
            const isVertical = this.placement.includes("top") || this.placement.includes("bottom");
            let topLeftX = 0;
            let topLeftY = 0;
            let topRightX = 0;
            let topRightY = 0;
            let bottomLeftX = 0;
            let bottomLeftY = 0;
            let bottomRightX = 0;
            let bottomRightY = 0;
            if (isVertical) {
              if (anchorRect.top < popupRect.top) {
                topLeftX = anchorRect.left;
                topLeftY = anchorRect.bottom;
                topRightX = anchorRect.right;
                topRightY = anchorRect.bottom;
                bottomLeftX = popupRect.left;
                bottomLeftY = popupRect.top;
                bottomRightX = popupRect.right;
                bottomRightY = popupRect.top;
              } else {
                topLeftX = popupRect.left;
                topLeftY = popupRect.bottom;
                topRightX = popupRect.right;
                topRightY = popupRect.bottom;
                bottomLeftX = anchorRect.left;
                bottomLeftY = anchorRect.top;
                bottomRightX = anchorRect.right;
                bottomRightY = anchorRect.top;
              }
            } else {
              if (anchorRect.left < popupRect.left) {
                topLeftX = anchorRect.right;
                topLeftY = anchorRect.top;
                topRightX = popupRect.left;
                topRightY = popupRect.top;
                bottomLeftX = anchorRect.right;
                bottomLeftY = anchorRect.bottom;
                bottomRightX = popupRect.left;
                bottomRightY = popupRect.bottom;
              } else {
                topLeftX = popupRect.right;
                topLeftY = popupRect.top;
                topRightX = anchorRect.left;
                topRightY = anchorRect.top;
                bottomLeftX = popupRect.right;
                bottomLeftY = popupRect.bottom;
                bottomRightX = anchorRect.left;
                bottomRightY = anchorRect.bottom;
              }
            }
            this.style.setProperty("--hover-bridge-top-left-x", `${topLeftX}px`);
            this.style.setProperty("--hover-bridge-top-left-y", `${topLeftY}px`);
            this.style.setProperty("--hover-bridge-top-right-x", `${topRightX}px`);
            this.style.setProperty("--hover-bridge-top-right-y", `${topRightY}px`);
            this.style.setProperty("--hover-bridge-bottom-left-x", `${bottomLeftX}px`);
            this.style.setProperty("--hover-bridge-bottom-left-y", `${bottomLeftY}px`);
            this.style.setProperty("--hover-bridge-bottom-right-x", `${bottomRightX}px`);
            this.style.setProperty("--hover-bridge-bottom-right-y", `${bottomRightY}px`);
          }
        };
      }
      async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.start();
      }
      disconnectedCallback() {
        super.disconnectedCallback();
        this.stop();
      }
      async updated(changedProps) {
        super.updated(changedProps);
        if (changedProps.has("active")) {
          if (this.active) {
            this.start();
          } else {
            this.stop();
          }
        }
        if (changedProps.has("anchor")) {
          this.handleAnchorChange();
        }
        if (this.active) {
          await this.updateComplete;
          this.reposition();
        }
      }
      async handleAnchorChange() {
        await this.stop();
        if (this.anchor && typeof this.anchor === "string") {
          const root = this.getRootNode();
          this.anchorEl = root.getElementById(this.anchor);
        } else if (this.anchor instanceof Element || isVirtualElement(this.anchor)) {
          this.anchorEl = this.anchor;
        } else {
          this.anchorEl = this.querySelector('[slot="anchor"]');
        }
        if (this.anchorEl instanceof HTMLSlotElement) {
          this.anchorEl = this.anchorEl.assignedElements({ flatten: true })[0];
        }
        if (this.anchorEl && this.active) {
          this.start();
        }
      }
      start() {
        if (!this.anchorEl) {
          return;
        }
        this.cleanup = autoUpdate(this.anchorEl, this.popup, () => {
          this.reposition();
        });
      }
      async stop() {
        return new Promise((resolve) => {
          if (this.cleanup) {
            this.cleanup();
            this.cleanup = void 0;
            this.removeAttribute("data-current-placement");
            this.style.removeProperty("--auto-size-available-width");
            this.style.removeProperty("--auto-size-available-height");
            requestAnimationFrame(() => resolve());
          } else {
            resolve();
          }
        });
      }
      /** Forces the popup to recalculate and reposition itself. */
      reposition() {
        if (!this.active || !this.anchorEl) {
          return;
        }
        const middleware = [
          // The offset middleware goes first
          offset2({ mainAxis: this.distance, crossAxis: this.skidding })
        ];
        if (this.sync) {
          middleware.push(
            size2({
              apply: ({ rects }) => {
                const syncWidth = this.sync === "width" || this.sync === "both";
                const syncHeight = this.sync === "height" || this.sync === "both";
                this.popup.style.width = syncWidth ? `${rects.reference.width}px` : "";
                this.popup.style.height = syncHeight ? `${rects.reference.height}px` : "";
              }
            })
          );
        } else {
          this.popup.style.width = "";
          this.popup.style.height = "";
        }
        if (this.flip) {
          middleware.push(
            flip2({
              boundary: this.flipBoundary,
              // @ts-expect-error - We're converting a string attribute to an array here
              fallbackPlacements: this.flipFallbackPlacements,
              fallbackStrategy: this.flipFallbackStrategy === "best-fit" ? "bestFit" : "initialPlacement",
              padding: this.flipPadding
            })
          );
        }
        if (this.shift) {
          middleware.push(
            shift2({
              boundary: this.shiftBoundary,
              padding: this.shiftPadding
            })
          );
        }
        if (this.autoSize) {
          middleware.push(
            size2({
              boundary: this.autoSizeBoundary,
              padding: this.autoSizePadding,
              apply: ({ availableWidth, availableHeight }) => {
                if (this.autoSize === "vertical" || this.autoSize === "both") {
                  this.style.setProperty("--auto-size-available-height", `${availableHeight}px`);
                } else {
                  this.style.removeProperty("--auto-size-available-height");
                }
                if (this.autoSize === "horizontal" || this.autoSize === "both") {
                  this.style.setProperty("--auto-size-available-width", `${availableWidth}px`);
                } else {
                  this.style.removeProperty("--auto-size-available-width");
                }
              }
            })
          );
        } else {
          this.style.removeProperty("--auto-size-available-width");
          this.style.removeProperty("--auto-size-available-height");
        }
        if (this.arrow) {
          middleware.push(
            arrow2({
              element: this.arrowEl,
              padding: this.arrowPadding
            })
          );
        }
        const getOffsetParent2 = this.strategy === "absolute" ? (element) => platform.getOffsetParent(element, t5) : platform.getOffsetParent;
        computePosition2(this.anchorEl, this.popup, {
          placement: this.placement,
          middleware,
          strategy: this.strategy,
          platform: __spreadProps(__spreadValues({}, platform), {
            getOffsetParent: getOffsetParent2
          })
        }).then(({ x: x2, y: y3, middlewareData, placement }) => {
          const isRtl = this.localize.dir() === "rtl";
          const staticSide = { top: "bottom", right: "left", bottom: "top", left: "right" }[placement.split("-")[0]];
          this.setAttribute("data-current-placement", placement);
          Object.assign(this.popup.style, {
            left: `${x2}px`,
            top: `${y3}px`
          });
          if (this.arrow) {
            const arrowX = middlewareData.arrow.x;
            const arrowY = middlewareData.arrow.y;
            let top = "";
            let right = "";
            let bottom = "";
            let left = "";
            if (this.arrowPlacement === "start") {
              const value = typeof arrowX === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
              top = typeof arrowY === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
              right = isRtl ? value : "";
              left = isRtl ? "" : value;
            } else if (this.arrowPlacement === "end") {
              const value = typeof arrowX === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
              right = isRtl ? "" : value;
              left = isRtl ? value : "";
              bottom = typeof arrowY === "number" ? `calc(${this.arrowPadding}px - var(--arrow-padding-offset))` : "";
            } else if (this.arrowPlacement === "center") {
              left = typeof arrowX === "number" ? `calc(50% - var(--arrow-size-diagonal))` : "";
              top = typeof arrowY === "number" ? `calc(50% - var(--arrow-size-diagonal))` : "";
            } else {
              left = typeof arrowX === "number" ? `${arrowX}px` : "";
              top = typeof arrowY === "number" ? `${arrowY}px` : "";
            }
            Object.assign(this.arrowEl.style, {
              top,
              right,
              bottom,
              left,
              [staticSide]: "calc(var(--arrow-size-diagonal) * -1)"
            });
          }
        });
        requestAnimationFrame(() => this.updateHoverBridge());
        this.emit("sl-reposition");
      }
      render() {
        return x`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${e7({
          "popup-hover-bridge": true,
          "popup-hover-bridge--visible": this.hoverBridge && this.active
        })}
      ></span>

      <div
        part="popup"
        class=${e7({
          popup: true,
          "popup--active": this.active,
          "popup--fixed": this.strategy === "fixed",
          "popup--has-arrow": this.arrow
        })}
      >
        <slot></slot>
        ${this.arrow ? x`<div part="arrow" class="popup__arrow" role="presentation"></div>` : ""}
      </div>
    `;
      }
    };
    SlPopup.styles = [component_styles_default, popup_styles_default];
    __decorateClass([
      e5(".popup")
    ], SlPopup.prototype, "popup", 2);
    __decorateClass([
      e5(".popup__arrow")
    ], SlPopup.prototype, "arrowEl", 2);
    __decorateClass([
      n4()
    ], SlPopup.prototype, "anchor", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlPopup.prototype, "active", 2);
    __decorateClass([
      n4({ reflect: true })
    ], SlPopup.prototype, "placement", 2);
    __decorateClass([
      n4({ reflect: true })
    ], SlPopup.prototype, "strategy", 2);
    __decorateClass([
      n4({ type: Number })
    ], SlPopup.prototype, "distance", 2);
    __decorateClass([
      n4({ type: Number })
    ], SlPopup.prototype, "skidding", 2);
    __decorateClass([
      n4({ type: Boolean })
    ], SlPopup.prototype, "arrow", 2);
    __decorateClass([
      n4({ attribute: "arrow-placement" })
    ], SlPopup.prototype, "arrowPlacement", 2);
    __decorateClass([
      n4({ attribute: "arrow-padding", type: Number })
    ], SlPopup.prototype, "arrowPadding", 2);
    __decorateClass([
      n4({ type: Boolean })
    ], SlPopup.prototype, "flip", 2);
    __decorateClass([
      n4({
        attribute: "flip-fallback-placements",
        converter: {
          fromAttribute: (value) => {
            return value.split(" ").map((p3) => p3.trim()).filter((p3) => p3 !== "");
          },
          toAttribute: (value) => {
            return value.join(" ");
          }
        }
      })
    ], SlPopup.prototype, "flipFallbackPlacements", 2);
    __decorateClass([
      n4({ attribute: "flip-fallback-strategy" })
    ], SlPopup.prototype, "flipFallbackStrategy", 2);
    __decorateClass([
      n4({ type: Object })
    ], SlPopup.prototype, "flipBoundary", 2);
    __decorateClass([
      n4({ attribute: "flip-padding", type: Number })
    ], SlPopup.prototype, "flipPadding", 2);
    __decorateClass([
      n4({ type: Boolean })
    ], SlPopup.prototype, "shift", 2);
    __decorateClass([
      n4({ type: Object })
    ], SlPopup.prototype, "shiftBoundary", 2);
    __decorateClass([
      n4({ attribute: "shift-padding", type: Number })
    ], SlPopup.prototype, "shiftPadding", 2);
    __decorateClass([
      n4({ attribute: "auto-size" })
    ], SlPopup.prototype, "autoSize", 2);
    __decorateClass([
      n4()
    ], SlPopup.prototype, "sync", 2);
    __decorateClass([
      n4({ type: Object })
    ], SlPopup.prototype, "autoSizeBoundary", 2);
    __decorateClass([
      n4({ attribute: "auto-size-padding", type: Number })
    ], SlPopup.prototype, "autoSizePadding", 2);
    __decorateClass([
      n4({ attribute: "hover-bridge", type: Boolean })
    ], SlPopup.prototype, "hoverBridge", 2);
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ZSH6VD4N.js
var SlDropdown;
var init_chunk_ZSH6VD4N = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ZSH6VD4N.js"() {
    init_chunk_LXP7GVU3();
    init_chunk_LXDTFLWU();
    init_chunk_5J7BMMD5();
    init_chunk_UW6SLYOK();
    init_chunk_B4BZKR24();
    init_chunk_3EPZX5HE();
    init_chunk_WLV3FVBR();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
    init_class_map2();
    init_lit();
    init_if_defined2();
    init_decorators();
    SlDropdown = class extends ShoelaceElement {
      constructor() {
        super(...arguments);
        this.localize = new LocalizeController2(this);
        this.open = false;
        this.placement = "bottom-start";
        this.disabled = false;
        this.stayOpenOnSelect = false;
        this.distance = 0;
        this.skidding = 0;
        this.hoist = false;
        this.sync = void 0;
        this.handleKeyDown = (event) => {
          if (this.open && event.key === "Escape") {
            event.stopPropagation();
            this.hide();
            this.focusOnTrigger();
          }
        };
        this.handleDocumentKeyDown = (event) => {
          var _a;
          if (event.key === "Escape" && this.open && !this.closeWatcher) {
            event.stopPropagation();
            this.focusOnTrigger();
            this.hide();
            return;
          }
          if (event.key === "Tab") {
            if (this.open && ((_a = document.activeElement) == null ? void 0 : _a.tagName.toLowerCase()) === "sl-menu-item") {
              event.preventDefault();
              this.hide();
              this.focusOnTrigger();
              return;
            }
            setTimeout(() => {
              var _a2, _b, _c;
              const activeElement = ((_a2 = this.containingElement) == null ? void 0 : _a2.getRootNode()) instanceof ShadowRoot ? (_c = (_b = document.activeElement) == null ? void 0 : _b.shadowRoot) == null ? void 0 : _c.activeElement : document.activeElement;
              if (!this.containingElement || (activeElement == null ? void 0 : activeElement.closest(this.containingElement.tagName.toLowerCase())) !== this.containingElement) {
                this.hide();
              }
            });
          }
        };
        this.handleDocumentMouseDown = (event) => {
          const path = event.composedPath();
          if (this.containingElement && !path.includes(this.containingElement)) {
            this.hide();
          }
        };
        this.handlePanelSelect = (event) => {
          const target = event.target;
          if (!this.stayOpenOnSelect && target.tagName.toLowerCase() === "sl-menu") {
            this.hide();
            this.focusOnTrigger();
          }
        };
      }
      connectedCallback() {
        super.connectedCallback();
        if (!this.containingElement) {
          this.containingElement = this;
        }
      }
      firstUpdated() {
        this.panel.hidden = !this.open;
        if (this.open) {
          this.addOpenListeners();
          this.popup.active = true;
        }
      }
      disconnectedCallback() {
        super.disconnectedCallback();
        this.removeOpenListeners();
        this.hide();
      }
      focusOnTrigger() {
        const trigger = this.trigger.assignedElements({ flatten: true })[0];
        if (typeof (trigger == null ? void 0 : trigger.focus) === "function") {
          trigger.focus();
        }
      }
      getMenu() {
        return this.panel.assignedElements({ flatten: true }).find((el) => el.tagName.toLowerCase() === "sl-menu");
      }
      handleTriggerClick() {
        if (this.open) {
          this.hide();
        } else {
          this.show();
          this.focusOnTrigger();
        }
      }
      async handleTriggerKeyDown(event) {
        if ([" ", "Enter"].includes(event.key)) {
          event.preventDefault();
          this.handleTriggerClick();
          return;
        }
        const menu = this.getMenu();
        if (menu) {
          const menuItems = menu.getAllItems();
          const firstMenuItem = menuItems[0];
          const lastMenuItem = menuItems[menuItems.length - 1];
          if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
            event.preventDefault();
            if (!this.open) {
              this.show();
              await this.updateComplete;
            }
            if (menuItems.length > 0) {
              this.updateComplete.then(() => {
                if (event.key === "ArrowDown" || event.key === "Home") {
                  menu.setCurrentItem(firstMenuItem);
                  firstMenuItem.focus();
                }
                if (event.key === "ArrowUp" || event.key === "End") {
                  menu.setCurrentItem(lastMenuItem);
                  lastMenuItem.focus();
                }
              });
            }
          }
        }
      }
      handleTriggerKeyUp(event) {
        if (event.key === " ") {
          event.preventDefault();
        }
      }
      handleTriggerSlotChange() {
        this.updateAccessibleTrigger();
      }
      //
      // Slotted triggers can be arbitrary content, but we need to link them to the dropdown panel with `aria-haspopup` and
      // `aria-expanded`. These must be applied to the "accessible trigger" (the tabbable portion of the trigger element
      // that gets slotted in) so screen readers will understand them. The accessible trigger could be the slotted element,
      // a child of the slotted element, or an element in the slotted element's shadow root.
      //
      // For example, the accessible trigger of an <sl-button> is a <button> located inside its shadow root.
      //
      // To determine this, we assume the first tabbable element in the trigger slot is the "accessible trigger."
      //
      updateAccessibleTrigger() {
        const assignedElements = this.trigger.assignedElements({ flatten: true });
        const accessibleTrigger = assignedElements.find((el) => getTabbableBoundary(el).start);
        let target;
        if (accessibleTrigger) {
          switch (accessibleTrigger.tagName.toLowerCase()) {
            case "sl-button":
            case "sl-icon-button":
              target = accessibleTrigger.button;
              break;
            default:
              target = accessibleTrigger;
          }
          target.setAttribute("aria-haspopup", "true");
          target.setAttribute("aria-expanded", this.open ? "true" : "false");
        }
      }
      /** Shows the dropdown panel. */
      async show() {
        if (this.open) {
          return void 0;
        }
        this.open = true;
        return waitForEvent(this, "sl-after-show");
      }
      /** Hides the dropdown panel */
      async hide() {
        if (!this.open) {
          return void 0;
        }
        this.open = false;
        return waitForEvent(this, "sl-after-hide");
      }
      /**
       * Instructs the dropdown menu to reposition. Useful when the position or size of the trigger changes when the menu
       * is activated.
       */
      reposition() {
        this.popup.reposition();
      }
      addOpenListeners() {
        var _a;
        this.panel.addEventListener("sl-select", this.handlePanelSelect);
        if ("CloseWatcher" in window) {
          (_a = this.closeWatcher) == null ? void 0 : _a.destroy();
          this.closeWatcher = new CloseWatcher();
          this.closeWatcher.onclose = () => {
            this.hide();
            this.focusOnTrigger();
          };
        } else {
          this.panel.addEventListener("keydown", this.handleKeyDown);
        }
        document.addEventListener("keydown", this.handleDocumentKeyDown);
        document.addEventListener("mousedown", this.handleDocumentMouseDown);
      }
      removeOpenListeners() {
        var _a;
        if (this.panel) {
          this.panel.removeEventListener("sl-select", this.handlePanelSelect);
          this.panel.removeEventListener("keydown", this.handleKeyDown);
        }
        document.removeEventListener("keydown", this.handleDocumentKeyDown);
        document.removeEventListener("mousedown", this.handleDocumentMouseDown);
        (_a = this.closeWatcher) == null ? void 0 : _a.destroy();
      }
      async handleOpenChange() {
        if (this.disabled) {
          this.open = false;
          return;
        }
        this.updateAccessibleTrigger();
        if (this.open) {
          this.emit("sl-show");
          this.addOpenListeners();
          await stopAnimations(this);
          this.panel.hidden = false;
          this.popup.active = true;
          const { keyframes, options } = getAnimation(this, "dropdown.show", { dir: this.localize.dir() });
          await animateTo(this.popup.popup, keyframes, options);
          this.emit("sl-after-show");
        } else {
          this.emit("sl-hide");
          this.removeOpenListeners();
          await stopAnimations(this);
          const { keyframes, options } = getAnimation(this, "dropdown.hide", { dir: this.localize.dir() });
          await animateTo(this.popup.popup, keyframes, options);
          this.panel.hidden = true;
          this.popup.active = false;
          this.emit("sl-after-hide");
        }
      }
      render() {
        return x`
      <sl-popup
        part="base"
        exportparts="popup:base__popup"
        id="dropdown"
        placement=${this.placement}
        distance=${this.distance}
        skidding=${this.skidding}
        strategy=${this.hoist ? "fixed" : "absolute"}
        flip
        shift
        auto-size="vertical"
        auto-size-padding="10"
        sync=${o5(this.sync ? this.sync : void 0)}
        class=${e7({
          dropdown: true,
          "dropdown--open": this.open
        })}
      >
        <slot
          name="trigger"
          slot="anchor"
          part="trigger"
          class="dropdown__trigger"
          @click=${this.handleTriggerClick}
          @keydown=${this.handleTriggerKeyDown}
          @keyup=${this.handleTriggerKeyUp}
          @slotchange=${this.handleTriggerSlotChange}
        ></slot>

        <div aria-hidden=${this.open ? "false" : "true"} aria-labelledby="dropdown">
          <slot part="panel" class="dropdown__panel"></slot>
        </div>
      </sl-popup>
    `;
      }
    };
    SlDropdown.styles = [component_styles_default, dropdown_styles_default];
    SlDropdown.dependencies = { "sl-popup": SlPopup };
    __decorateClass([
      e5(".dropdown")
    ], SlDropdown.prototype, "popup", 2);
    __decorateClass([
      e5(".dropdown__trigger")
    ], SlDropdown.prototype, "trigger", 2);
    __decorateClass([
      e5(".dropdown__panel")
    ], SlDropdown.prototype, "panel", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlDropdown.prototype, "open", 2);
    __decorateClass([
      n4({ reflect: true })
    ], SlDropdown.prototype, "placement", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlDropdown.prototype, "disabled", 2);
    __decorateClass([
      n4({ attribute: "stay-open-on-select", type: Boolean, reflect: true })
    ], SlDropdown.prototype, "stayOpenOnSelect", 2);
    __decorateClass([
      n4({ attribute: false })
    ], SlDropdown.prototype, "containingElement", 2);
    __decorateClass([
      n4({ type: Number })
    ], SlDropdown.prototype, "distance", 2);
    __decorateClass([
      n4({ type: Number })
    ], SlDropdown.prototype, "skidding", 2);
    __decorateClass([
      n4({ type: Boolean })
    ], SlDropdown.prototype, "hoist", 2);
    __decorateClass([
      n4({ reflect: true })
    ], SlDropdown.prototype, "sync", 2);
    __decorateClass([
      watch("open", { waitUntilFirstUpdate: true })
    ], SlDropdown.prototype, "handleOpenChange", 1);
    setDefaultAnimation("dropdown.show", {
      keyframes: [
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1 }
      ],
      options: { duration: 100, easing: "ease" }
    });
    setDefaultAnimation("dropdown.hide", {
      keyframes: [
        { opacity: 1, scale: 1 },
        { opacity: 0, scale: 0.9 }
      ],
      options: { duration: 100, easing: "ease" }
    });
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.QVOIHCVY.js
var init_chunk_QVOIHCVY = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.QVOIHCVY.js"() {
    init_chunk_ZSH6VD4N();
    SlDropdown.define("sl-dropdown");
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/dropdown/dropdown.js
var init_dropdown = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/dropdown/dropdown.js"() {
    init_chunk_QVOIHCVY();
    init_chunk_ZSH6VD4N();
    init_chunk_LXP7GVU3();
    init_chunk_LXDTFLWU();
    init_chunk_5J7BMMD5();
    init_chunk_3KSWVBQ5();
    init_chunk_UW6SLYOK();
    init_chunk_B4BZKR24();
    init_chunk_3EPZX5HE();
    init_chunk_WLV3FVBR();
    init_chunk_MAS2SHYD();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.VVA35HTY.js
var menu_styles_default;
var init_chunk_VVA35HTY = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.VVA35HTY.js"() {
    init_lit();
    menu_styles_default = i`
  :host {
    display: block;
    position: relative;
    background: var(--sl-panel-background-color);
    border: solid var(--sl-panel-border-width) var(--sl-panel-border-color);
    border-radius: var(--sl-border-radius-medium);
    padding: var(--sl-spacing-x-small) 0;
    overflow: auto;
    overscroll-behavior: none;
  }

  ::slotted(sl-divider) {
    --spacing: var(--sl-spacing-x-small);
  }
`;
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ZNAKKORO.js
var SlMenu;
var init_chunk_ZNAKKORO = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ZNAKKORO.js"() {
    init_chunk_VVA35HTY();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
    init_lit();
    init_decorators();
    SlMenu = class extends ShoelaceElement {
      connectedCallback() {
        super.connectedCallback();
        this.setAttribute("role", "menu");
      }
      handleClick(event) {
        const menuItemTypes = ["menuitem", "menuitemcheckbox"];
        const composedPath = event.composedPath();
        const target = composedPath.find((el) => {
          var _a;
          return menuItemTypes.includes(((_a = el == null ? void 0 : el.getAttribute) == null ? void 0 : _a.call(el, "role")) || "");
        });
        if (!target)
          return;
        const closestMenu = composedPath.find((el) => {
          var _a;
          return ((_a = el == null ? void 0 : el.getAttribute) == null ? void 0 : _a.call(el, "role")) === "menu";
        });
        const clickHasSubmenu = closestMenu !== this;
        if (clickHasSubmenu)
          return;
        const item = target;
        if (item.type === "checkbox") {
          item.checked = !item.checked;
        }
        this.emit("sl-select", { detail: { item } });
      }
      handleKeyDown(event) {
        if (event.key === "Enter" || event.key === " ") {
          const item = this.getCurrentItem();
          event.preventDefault();
          event.stopPropagation();
          item == null ? void 0 : item.click();
        } else if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
          const items = this.getAllItems();
          const activeItem = this.getCurrentItem();
          let index = activeItem ? items.indexOf(activeItem) : 0;
          if (items.length > 0) {
            event.preventDefault();
            event.stopPropagation();
            if (event.key === "ArrowDown") {
              index++;
            } else if (event.key === "ArrowUp") {
              index--;
            } else if (event.key === "Home") {
              index = 0;
            } else if (event.key === "End") {
              index = items.length - 1;
            }
            if (index < 0) {
              index = items.length - 1;
            }
            if (index > items.length - 1) {
              index = 0;
            }
            this.setCurrentItem(items[index]);
            items[index].focus();
          }
        }
      }
      handleMouseDown(event) {
        const target = event.target;
        if (this.isMenuItem(target)) {
          this.setCurrentItem(target);
        }
      }
      handleSlotChange() {
        const items = this.getAllItems();
        if (items.length > 0) {
          this.setCurrentItem(items[0]);
        }
      }
      isMenuItem(item) {
        var _a;
        return item.tagName.toLowerCase() === "sl-menu-item" || ["menuitem", "menuitemcheckbox", "menuitemradio"].includes((_a = item.getAttribute("role")) != null ? _a : "");
      }
      /** @internal Gets all slotted menu items, ignoring dividers, headers, and other elements. */
      getAllItems() {
        return [...this.defaultSlot.assignedElements({ flatten: true })].filter((el) => {
          if (el.inert || !this.isMenuItem(el)) {
            return false;
          }
          return true;
        });
      }
      /**
       * @internal Gets the current menu item, which is the menu item that has `tabindex="0"` within the roving tab index.
       * The menu item may or may not have focus, but for keyboard interaction purposes it's considered the "active" item.
       */
      getCurrentItem() {
        return this.getAllItems().find((i7) => i7.getAttribute("tabindex") === "0");
      }
      /**
       * @internal Sets the current menu item to the specified element. This sets `tabindex="0"` on the target element and
       * `tabindex="-1"` to all other items. This method must be called prior to setting focus on a menu item.
       */
      setCurrentItem(item) {
        const items = this.getAllItems();
        items.forEach((i7) => {
          i7.setAttribute("tabindex", i7 === item ? "0" : "-1");
        });
      }
      render() {
        return x`
      <slot
        @slotchange=${this.handleSlotChange}
        @click=${this.handleClick}
        @keydown=${this.handleKeyDown}
        @mousedown=${this.handleMouseDown}
      ></slot>
    `;
      }
    };
    SlMenu.styles = [component_styles_default, menu_styles_default];
    __decorateClass([
      e5("slot")
    ], SlMenu.prototype, "defaultSlot", 2);
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.JW3F7MUK.js
var init_chunk_JW3F7MUK = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.JW3F7MUK.js"() {
    init_chunk_ZNAKKORO();
    SlMenu.define("sl-menu");
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/menu/menu.js
var init_menu = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/menu/menu.js"() {
    init_chunk_JW3F7MUK();
    init_chunk_ZNAKKORO();
    init_chunk_VVA35HTY();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.KZJNDGFO.js
var menu_item_styles_default;
var init_chunk_KZJNDGFO = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.KZJNDGFO.js"() {
    init_lit();
    menu_item_styles_default = i`
  :host {
    --submenu-offset: -2px;

    display: block;
  }

  :host([inert]) {
    display: none;
  }

  .menu-item {
    position: relative;
    display: flex;
    align-items: stretch;
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    font-weight: var(--sl-font-weight-normal);
    line-height: var(--sl-line-height-normal);
    letter-spacing: var(--sl-letter-spacing-normal);
    color: var(--sl-color-neutral-700);
    padding: var(--sl-spacing-2x-small) var(--sl-spacing-2x-small);
    transition: var(--sl-transition-fast) fill;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    cursor: pointer;
  }

  .menu-item.menu-item--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .menu-item.menu-item--loading {
    outline: none;
    cursor: wait;
  }

  .menu-item.menu-item--loading *:not(sl-spinner) {
    opacity: 0.5;
  }

  .menu-item--loading sl-spinner {
    --indicator-color: currentColor;
    --track-width: 1px;
    position: absolute;
    font-size: 0.75em;
    top: calc(50% - 0.5em);
    left: 0.65rem;
    opacity: 1;
  }

  .menu-item .menu-item__label {
    flex: 1 1 auto;
    display: inline-block;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .menu-item .menu-item__prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__prefix::slotted(*) {
    margin-inline-end: var(--sl-spacing-x-small);
  }

  .menu-item .menu-item__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .menu-item .menu-item__suffix::slotted(*) {
    margin-inline-start: var(--sl-spacing-x-small);
  }

  /* Safe triangle */
  .menu-item--submenu-expanded::after {
    content: '';
    position: fixed;
    z-index: calc(var(--sl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--safe-triangle-cursor-x, 0) var(--safe-triangle-cursor-y, 0),
      var(--safe-triangle-submenu-start-x, 0) var(--safe-triangle-submenu-start-y, 0),
      var(--safe-triangle-submenu-end-x, 0) var(--safe-triangle-submenu-end-y, 0)
    );
  }

  :host(:focus-visible) {
    outline: none;
  }

  :host(:hover:not([aria-disabled='true'], :focus-visible)) .menu-item,
  .menu-item--submenu-expanded {
    background-color: var(--sl-color-neutral-100);
    color: var(--sl-color-neutral-1000);
  }

  :host(:focus-visible) .menu-item {
    outline: none;
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
    opacity: 1;
  }

  .menu-item .menu-item__check,
  .menu-item .menu-item__chevron {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5em;
    visibility: hidden;
  }

  .menu-item--checked .menu-item__check,
  .menu-item--has-submenu .menu-item__chevron {
    visibility: visible;
  }

  /* Add elevation and z-index to submenus */
  sl-popup::part(popup) {
    box-shadow: var(--sl-shadow-large);
    z-index: var(--sl-z-index-dropdown);
    margin-left: var(--submenu-offset);
  }

  .menu-item--rtl sl-popup::part(popup) {
    margin-left: calc(-1 * var(--submenu-offset));
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .menu-item,
    :host(:focus-visible) .menu-item {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }

  ::slotted(sl-menu) {
    max-width: var(--auto-size-available-width) !important;
    max-height: var(--auto-size-available-height) !important;
  }
`;
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/async-directive.js
function h3(i7) {
  void 0 !== this._$AN ? (o7(this), this._$AM = i7, r8(this)) : this._$AM = i7;
}
function n5(i7, t6 = false, e10 = 0) {
  const r9 = this._$AH, h5 = this._$AN;
  if (void 0 !== h5 && 0 !== h5.size) if (t6) if (Array.isArray(r9)) for (let i8 = e10; i8 < r9.length; i8++) s3(r9[i8], false), o7(r9[i8]);
  else null != r9 && (s3(r9, false), o7(r9));
  else s3(this, i7);
}
var s3, o7, r8, c4, f4;
var init_async_directive = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/async-directive.js"() {
    init_directive_helpers();
    init_directive();
    init_directive();
    s3 = (i7, t6) => {
      const e10 = i7._$AN;
      if (void 0 === e10) return false;
      for (const i8 of e10) i8._$AO?.(t6, false), s3(i8, t6);
      return true;
    };
    o7 = (i7) => {
      let t6, e10;
      do {
        if (void 0 === (t6 = i7._$AM)) break;
        e10 = t6._$AN, e10.delete(i7), i7 = t6;
      } while (0 === e10?.size);
    };
    r8 = (i7) => {
      for (let t6; t6 = i7._$AM; i7 = t6) {
        let e10 = t6._$AN;
        if (void 0 === e10) t6._$AN = e10 = /* @__PURE__ */ new Set();
        else if (e10.has(i7)) break;
        e10.add(i7), c4(t6);
      }
    };
    c4 = (i7) => {
      i7.type == t3.CHILD && (i7._$AP ?? (i7._$AP = n5), i7._$AQ ?? (i7._$AQ = h3));
    };
    f4 = class extends i5 {
      constructor() {
        super(...arguments), this._$AN = void 0;
      }
      _$AT(i7, t6, e10) {
        super._$AT(i7, t6, e10), r8(this), this.isConnected = i7._$AU;
      }
      _$AO(i7, t6 = true) {
        i7 !== this.isConnected && (this.isConnected = i7, i7 ? this.reconnected?.() : this.disconnected?.()), t6 && (s3(this, i7), o7(this));
      }
      setValue(t6) {
        if (f3(this._$Ct)) this._$Ct._$AI(t6, this);
        else {
          const i7 = [...this._$Ct._$AH];
          i7[this._$Ci] = t6, this._$Ct._$AI(i7, this, 0);
        }
      }
      disconnected() {
      }
      reconnected() {
      }
    };
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/ref.js
var e9, h4, o8, n6;
var init_ref = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directives/ref.js"() {
    init_lit_html();
    init_async_directive();
    init_directive();
    e9 = () => new h4();
    h4 = class {
    };
    o8 = /* @__PURE__ */ new WeakMap();
    n6 = e6(class extends f4 {
      render(i7) {
        return E;
      }
      update(i7, [s4]) {
        const e10 = s4 !== this.Y;
        return e10 && void 0 !== this.Y && this.rt(void 0), (e10 || this.lt !== this.ct) && (this.Y = s4, this.ht = i7.options?.host, this.rt(this.ct = i7.element)), E;
      }
      rt(t6) {
        if (this.isConnected || (t6 = void 0), "function" == typeof this.Y) {
          const i7 = this.ht ?? globalThis;
          let s4 = o8.get(i7);
          void 0 === s4 && (s4 = /* @__PURE__ */ new WeakMap(), o8.set(i7, s4)), void 0 !== s4.get(this.Y) && this.Y.call(this.ht, void 0), s4.set(this.Y, t6), void 0 !== t6 && this.Y.call(this.ht, t6);
        } else this.Y.value = t6;
      }
      get lt() {
        return "function" == typeof this.Y ? o8.get(this.ht ?? globalThis)?.get(this.Y) : this.Y?.value;
      }
      disconnected() {
        this.lt === this.ct && this.rt(void 0);
      }
      reconnected() {
        this.rt(this.ct);
      }
    });
  }
});

// node_modules/.pnpm/lit@3.2.1/node_modules/lit/directives/ref.js
var init_ref2 = __esm({
  "node_modules/.pnpm/lit@3.2.1/node_modules/lit/directives/ref.js"() {
    init_ref();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ZLIGP6HZ.js
var SubmenuController;
var init_chunk_ZLIGP6HZ = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.ZLIGP6HZ.js"() {
    init_ref2();
    init_lit();
    SubmenuController = class {
      constructor(host, hasSlotController) {
        this.popupRef = e9();
        this.enableSubmenuTimer = -1;
        this.isConnected = false;
        this.isPopupConnected = false;
        this.skidding = 0;
        this.submenuOpenDelay = 100;
        this.handleMouseMove = (event) => {
          this.host.style.setProperty("--safe-triangle-cursor-x", `${event.clientX}px`);
          this.host.style.setProperty("--safe-triangle-cursor-y", `${event.clientY}px`);
        };
        this.handleMouseOver = () => {
          if (this.hasSlotController.test("submenu")) {
            this.enableSubmenu();
          }
        };
        this.handleKeyDown = (event) => {
          switch (event.key) {
            case "Escape":
            case "Tab":
              this.disableSubmenu();
              break;
            case "ArrowLeft":
              if (event.target !== this.host) {
                event.preventDefault();
                event.stopPropagation();
                this.host.focus();
                this.disableSubmenu();
              }
              break;
            case "ArrowRight":
            case "Enter":
            case " ":
              this.handleSubmenuEntry(event);
              break;
            default:
              break;
          }
        };
        this.handleClick = (event) => {
          var _a;
          if (event.target === this.host) {
            event.preventDefault();
            event.stopPropagation();
          } else if (event.target instanceof Element && (event.target.tagName === "sl-menu-item" || ((_a = event.target.role) == null ? void 0 : _a.startsWith("menuitem")))) {
            this.disableSubmenu();
          }
        };
        this.handleFocusOut = (event) => {
          if (event.relatedTarget && event.relatedTarget instanceof Element && this.host.contains(event.relatedTarget)) {
            return;
          }
          this.disableSubmenu();
        };
        this.handlePopupMouseover = (event) => {
          event.stopPropagation();
        };
        this.handlePopupReposition = () => {
          const submenuSlot = this.host.renderRoot.querySelector("slot[name='submenu']");
          const menu = submenuSlot == null ? void 0 : submenuSlot.assignedElements({ flatten: true }).filter((el) => el.localName === "sl-menu")[0];
          const isRtl = getComputedStyle(this.host).direction === "rtl";
          if (!menu) {
            return;
          }
          const { left, top, width, height } = menu.getBoundingClientRect();
          this.host.style.setProperty("--safe-triangle-submenu-start-x", `${isRtl ? left + width : left}px`);
          this.host.style.setProperty("--safe-triangle-submenu-start-y", `${top}px`);
          this.host.style.setProperty("--safe-triangle-submenu-end-x", `${isRtl ? left + width : left}px`);
          this.host.style.setProperty("--safe-triangle-submenu-end-y", `${top + height}px`);
        };
        (this.host = host).addController(this);
        this.hasSlotController = hasSlotController;
      }
      hostConnected() {
        if (this.hasSlotController.test("submenu") && !this.host.disabled) {
          this.addListeners();
        }
      }
      hostDisconnected() {
        this.removeListeners();
      }
      hostUpdated() {
        if (this.hasSlotController.test("submenu") && !this.host.disabled) {
          this.addListeners();
          this.updateSkidding();
        } else {
          this.removeListeners();
        }
      }
      addListeners() {
        if (!this.isConnected) {
          this.host.addEventListener("mousemove", this.handleMouseMove);
          this.host.addEventListener("mouseover", this.handleMouseOver);
          this.host.addEventListener("keydown", this.handleKeyDown);
          this.host.addEventListener("click", this.handleClick);
          this.host.addEventListener("focusout", this.handleFocusOut);
          this.isConnected = true;
        }
        if (!this.isPopupConnected) {
          if (this.popupRef.value) {
            this.popupRef.value.addEventListener("mouseover", this.handlePopupMouseover);
            this.popupRef.value.addEventListener("sl-reposition", this.handlePopupReposition);
            this.isPopupConnected = true;
          }
        }
      }
      removeListeners() {
        if (this.isConnected) {
          this.host.removeEventListener("mousemove", this.handleMouseMove);
          this.host.removeEventListener("mouseover", this.handleMouseOver);
          this.host.removeEventListener("keydown", this.handleKeyDown);
          this.host.removeEventListener("click", this.handleClick);
          this.host.removeEventListener("focusout", this.handleFocusOut);
          this.isConnected = false;
        }
        if (this.isPopupConnected) {
          if (this.popupRef.value) {
            this.popupRef.value.removeEventListener("mouseover", this.handlePopupMouseover);
            this.popupRef.value.removeEventListener("sl-reposition", this.handlePopupReposition);
            this.isPopupConnected = false;
          }
        }
      }
      handleSubmenuEntry(event) {
        const submenuSlot = this.host.renderRoot.querySelector("slot[name='submenu']");
        if (!submenuSlot) {
          console.error("Cannot activate a submenu if no corresponding menuitem can be found.", this);
          return;
        }
        let menuItems = null;
        for (const elt of submenuSlot.assignedElements()) {
          menuItems = elt.querySelectorAll("sl-menu-item, [role^='menuitem']");
          if (menuItems.length !== 0) {
            break;
          }
        }
        if (!menuItems || menuItems.length === 0) {
          return;
        }
        menuItems[0].setAttribute("tabindex", "0");
        for (let i7 = 1; i7 !== menuItems.length; ++i7) {
          menuItems[i7].setAttribute("tabindex", "-1");
        }
        if (this.popupRef.value) {
          event.preventDefault();
          event.stopPropagation();
          if (this.popupRef.value.active) {
            if (menuItems[0] instanceof HTMLElement) {
              menuItems[0].focus();
            }
          } else {
            this.enableSubmenu(false);
            this.host.updateComplete.then(() => {
              if (menuItems[0] instanceof HTMLElement) {
                menuItems[0].focus();
              }
            });
            this.host.requestUpdate();
          }
        }
      }
      setSubmenuState(state) {
        if (this.popupRef.value) {
          if (this.popupRef.value.active !== state) {
            this.popupRef.value.active = state;
            this.host.requestUpdate();
          }
        }
      }
      // Shows the submenu. Supports disabling the opening delay, e.g. for keyboard events that want to set the focus to the
      // newly opened menu.
      enableSubmenu(delay = true) {
        if (delay) {
          window.clearTimeout(this.enableSubmenuTimer);
          this.enableSubmenuTimer = window.setTimeout(() => {
            this.setSubmenuState(true);
          }, this.submenuOpenDelay);
        } else {
          this.setSubmenuState(true);
        }
      }
      disableSubmenu() {
        window.clearTimeout(this.enableSubmenuTimer);
        this.setSubmenuState(false);
      }
      // Calculate the space the top of a menu takes-up, for aligning the popup menu-item with the activating element.
      updateSkidding() {
        var _a;
        if (!((_a = this.host.parentElement) == null ? void 0 : _a.computedStyleMap)) {
          return;
        }
        const styleMap = this.host.parentElement.computedStyleMap();
        const attrs = ["padding-top", "border-top-width", "margin-top"];
        const skidding = attrs.reduce((accumulator, attr) => {
          var _a2;
          const styleValue = (_a2 = styleMap.get(attr)) != null ? _a2 : new CSSUnitValue(0, "px");
          const unitValue = styleValue instanceof CSSUnitValue ? styleValue : new CSSUnitValue(0, "px");
          const pxValue = unitValue.to("px");
          return accumulator - pxValue.value;
        }, 0);
        this.skidding = skidding;
      }
      isExpanded() {
        return this.popupRef.value ? this.popupRef.value.active : false;
      }
      renderSubmenu() {
        const isRtl = getComputedStyle(this.host).direction === "rtl";
        if (!this.isConnected) {
          return x` <slot name="submenu" hidden></slot> `;
        }
        return x`
      <sl-popup
        ${n6(this.popupRef)}
        placement=${isRtl ? "left-start" : "right-start"}
        anchor="anchor"
        flip
        flip-fallback-strategy="best-fit"
        skidding="${this.skidding}"
        strategy="fixed"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <slot name="submenu"></slot>
      </sl-popup>
    `;
      }
    };
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.NYIIDP5N.js
function getTextContent(slot) {
  if (!slot) {
    return "";
  }
  const nodes = slot.assignedNodes({ flatten: true });
  let text = "";
  [...nodes].forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    }
  });
  return text;
}
var HasSlotController;
var init_chunk_NYIIDP5N = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.NYIIDP5N.js"() {
    HasSlotController = class {
      constructor(host, ...slotNames) {
        this.slotNames = [];
        this.handleSlotChange = (event) => {
          const slot = event.target;
          if (this.slotNames.includes("[default]") && !slot.name || slot.name && this.slotNames.includes(slot.name)) {
            this.host.requestUpdate();
          }
        };
        (this.host = host).addController(this);
        this.slotNames = slotNames;
      }
      hasDefaultSlot() {
        return [...this.host.childNodes].some((node) => {
          if (node.nodeType === node.TEXT_NODE && node.textContent.trim() !== "") {
            return true;
          }
          if (node.nodeType === node.ELEMENT_NODE) {
            const el = node;
            const tagName = el.tagName.toLowerCase();
            if (tagName === "sl-visually-hidden") {
              return false;
            }
            if (!el.hasAttribute("slot")) {
              return true;
            }
          }
          return false;
        });
      }
      hasNamedSlot(name) {
        return this.host.querySelector(`:scope > [slot="${name}"]`) !== null;
      }
      test(slotName) {
        return slotName === "[default]" ? this.hasDefaultSlot() : this.hasNamedSlot(slotName);
      }
      hostConnected() {
        this.host.shadowRoot.addEventListener("slotchange", this.handleSlotChange);
      }
      hostDisconnected() {
        this.host.shadowRoot.removeEventListener("slotchange", this.handleSlotChange);
      }
    };
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.22WT5API.js
var SlMenuItem;
var init_chunk_22WT5API = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.22WT5API.js"() {
    init_chunk_KZJNDGFO();
    init_chunk_ZLIGP6HZ();
    init_chunk_5J7BMMD5();
    init_chunk_TLKDQ5JG();
    init_chunk_WLV3FVBR();
    init_chunk_NYIIDP5N();
    init_chunk_E6QAPUBK();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
    init_class_map2();
    init_lit();
    init_decorators();
    SlMenuItem = class extends ShoelaceElement {
      constructor() {
        super(...arguments);
        this.localize = new LocalizeController2(this);
        this.type = "normal";
        this.checked = false;
        this.value = "";
        this.loading = false;
        this.disabled = false;
        this.hasSlotController = new HasSlotController(this, "submenu");
        this.submenuController = new SubmenuController(this, this.hasSlotController);
        this.handleHostClick = (event) => {
          if (this.disabled) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        };
        this.handleMouseOver = (event) => {
          this.focus();
          event.stopPropagation();
        };
      }
      connectedCallback() {
        super.connectedCallback();
        this.addEventListener("click", this.handleHostClick);
        this.addEventListener("mouseover", this.handleMouseOver);
      }
      disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener("click", this.handleHostClick);
        this.removeEventListener("mouseover", this.handleMouseOver);
      }
      handleDefaultSlotChange() {
        const textLabel = this.getTextLabel();
        if (typeof this.cachedTextLabel === "undefined") {
          this.cachedTextLabel = textLabel;
          return;
        }
        if (textLabel !== this.cachedTextLabel) {
          this.cachedTextLabel = textLabel;
          this.emit("slotchange", { bubbles: true, composed: false, cancelable: false });
        }
      }
      handleCheckedChange() {
        if (this.checked && this.type !== "checkbox") {
          this.checked = false;
          console.error('The checked attribute can only be used on menu items with type="checkbox"', this);
          return;
        }
        if (this.type === "checkbox") {
          this.setAttribute("aria-checked", this.checked ? "true" : "false");
        } else {
          this.removeAttribute("aria-checked");
        }
      }
      handleDisabledChange() {
        this.setAttribute("aria-disabled", this.disabled ? "true" : "false");
      }
      handleTypeChange() {
        if (this.type === "checkbox") {
          this.setAttribute("role", "menuitemcheckbox");
          this.setAttribute("aria-checked", this.checked ? "true" : "false");
        } else {
          this.setAttribute("role", "menuitem");
          this.removeAttribute("aria-checked");
        }
      }
      /** Returns a text label based on the contents of the menu item's default slot. */
      getTextLabel() {
        return getTextContent(this.defaultSlot);
      }
      isSubmenu() {
        return this.hasSlotController.test("submenu");
      }
      render() {
        const isRtl = this.localize.dir() === "rtl";
        const isSubmenuExpanded = this.submenuController.isExpanded();
        return x`
      <div
        id="anchor"
        part="base"
        class=${e7({
          "menu-item": true,
          "menu-item--rtl": isRtl,
          "menu-item--checked": this.checked,
          "menu-item--disabled": this.disabled,
          "menu-item--loading": this.loading,
          "menu-item--has-submenu": this.isSubmenu(),
          "menu-item--submenu-expanded": isSubmenuExpanded
        })}
        ?aria-haspopup="${this.isSubmenu()}"
        ?aria-expanded="${isSubmenuExpanded ? true : false}"
      >
        <span part="checked-icon" class="menu-item__check">
          <sl-icon name="check" library="system" aria-hidden="true"></sl-icon>
        </span>

        <slot name="prefix" part="prefix" class="menu-item__prefix"></slot>

        <slot part="label" class="menu-item__label" @slotchange=${this.handleDefaultSlotChange}></slot>

        <slot name="suffix" part="suffix" class="menu-item__suffix"></slot>

        <span part="submenu-icon" class="menu-item__chevron">
          <sl-icon name=${isRtl ? "chevron-left" : "chevron-right"} library="system" aria-hidden="true"></sl-icon>
        </span>

        ${this.submenuController.renderSubmenu()}
        ${this.loading ? x` <sl-spinner part="spinner" exportparts="base:spinner__base"></sl-spinner> ` : ""}
      </div>
    `;
      }
    };
    SlMenuItem.styles = [component_styles_default, menu_item_styles_default];
    SlMenuItem.dependencies = {
      "sl-icon": SlIcon,
      "sl-popup": SlPopup,
      "sl-spinner": SlSpinner
    };
    __decorateClass([
      e5("slot:not([name])")
    ], SlMenuItem.prototype, "defaultSlot", 2);
    __decorateClass([
      e5(".menu-item")
    ], SlMenuItem.prototype, "menuItem", 2);
    __decorateClass([
      n4()
    ], SlMenuItem.prototype, "type", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlMenuItem.prototype, "checked", 2);
    __decorateClass([
      n4()
    ], SlMenuItem.prototype, "value", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlMenuItem.prototype, "loading", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlMenuItem.prototype, "disabled", 2);
    __decorateClass([
      watch("checked")
    ], SlMenuItem.prototype, "handleCheckedChange", 1);
    __decorateClass([
      watch("disabled")
    ], SlMenuItem.prototype, "handleDisabledChange", 1);
    __decorateClass([
      watch("type")
    ], SlMenuItem.prototype, "handleTypeChange", 1);
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.I2JSEN3V.js
var init_chunk_I2JSEN3V = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.I2JSEN3V.js"() {
    init_chunk_22WT5API();
    SlMenuItem.define("sl-menu-item");
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/menu-item/menu-item.js
var init_menu_item = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/menu-item/menu-item.js"() {
    init_chunk_I2JSEN3V();
    init_chunk_22WT5API();
    init_chunk_KZJNDGFO();
    init_chunk_ZLIGP6HZ();
    init_chunk_5J7BMMD5();
    init_chunk_3KSWVBQ5();
    init_chunk_TLKDQ5JG();
    init_chunk_7DUCI5S4();
    init_chunk_WLV3FVBR();
    init_chunk_MAS2SHYD();
    init_chunk_NYIIDP5N();
    init_chunk_E6QAPUBK();
    init_chunk_ZL53POKZ();
    init_chunk_P7ZG6EMR();
    init_chunk_3TFKS637();
    init_chunk_QLXRCYS4();
    init_chunk_3Y6SB6QS();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.2RCF7SLU.js
var formCollections, reportValidityOverloads, checkValidityOverloads, userInteractedControls, interactions, FormControlController, validValidityState, valueMissingValidityState, customErrorValidityState;
var init_chunk_2RCF7SLU = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.2RCF7SLU.js"() {
    init_chunk_B3BW2AY6();
    formCollections = /* @__PURE__ */ new WeakMap();
    reportValidityOverloads = /* @__PURE__ */ new WeakMap();
    checkValidityOverloads = /* @__PURE__ */ new WeakMap();
    userInteractedControls = /* @__PURE__ */ new WeakSet();
    interactions = /* @__PURE__ */ new WeakMap();
    FormControlController = class {
      constructor(host, options) {
        this.handleFormData = (event) => {
          const disabled = this.options.disabled(this.host);
          const name = this.options.name(this.host);
          const value = this.options.value(this.host);
          const isButton = this.host.tagName.toLowerCase() === "sl-button";
          if (this.host.isConnected && !disabled && !isButton && typeof name === "string" && name.length > 0 && typeof value !== "undefined") {
            if (Array.isArray(value)) {
              value.forEach((val) => {
                event.formData.append(name, val.toString());
              });
            } else {
              event.formData.append(name, value.toString());
            }
          }
        };
        this.handleFormSubmit = (event) => {
          var _a;
          const disabled = this.options.disabled(this.host);
          const reportValidity = this.options.reportValidity;
          if (this.form && !this.form.noValidate) {
            (_a = formCollections.get(this.form)) == null ? void 0 : _a.forEach((control) => {
              this.setUserInteracted(control, true);
            });
          }
          if (this.form && !this.form.noValidate && !disabled && !reportValidity(this.host)) {
            event.preventDefault();
            event.stopImmediatePropagation();
          }
        };
        this.handleFormReset = () => {
          this.options.setValue(this.host, this.options.defaultValue(this.host));
          this.setUserInteracted(this.host, false);
          interactions.set(this.host, []);
        };
        this.handleInteraction = (event) => {
          const emittedEvents = interactions.get(this.host);
          if (!emittedEvents.includes(event.type)) {
            emittedEvents.push(event.type);
          }
          if (emittedEvents.length === this.options.assumeInteractionOn.length) {
            this.setUserInteracted(this.host, true);
          }
        };
        this.checkFormValidity = () => {
          if (this.form && !this.form.noValidate) {
            const elements = this.form.querySelectorAll("*");
            for (const element of elements) {
              if (typeof element.checkValidity === "function") {
                if (!element.checkValidity()) {
                  return false;
                }
              }
            }
          }
          return true;
        };
        this.reportFormValidity = () => {
          if (this.form && !this.form.noValidate) {
            const elements = this.form.querySelectorAll("*");
            for (const element of elements) {
              if (typeof element.reportValidity === "function") {
                if (!element.reportValidity()) {
                  return false;
                }
              }
            }
          }
          return true;
        };
        (this.host = host).addController(this);
        this.options = __spreadValues({
          form: (input) => {
            const formId = input.form;
            if (formId) {
              const root = input.getRootNode();
              const form = root.querySelector(`#${formId}`);
              if (form) {
                return form;
              }
            }
            return input.closest("form");
          },
          name: (input) => input.name,
          value: (input) => input.value,
          defaultValue: (input) => input.defaultValue,
          disabled: (input) => {
            var _a;
            return (_a = input.disabled) != null ? _a : false;
          },
          reportValidity: (input) => typeof input.reportValidity === "function" ? input.reportValidity() : true,
          checkValidity: (input) => typeof input.checkValidity === "function" ? input.checkValidity() : true,
          setValue: (input, value) => input.value = value,
          assumeInteractionOn: ["sl-input"]
        }, options);
      }
      hostConnected() {
        const form = this.options.form(this.host);
        if (form) {
          this.attachForm(form);
        }
        interactions.set(this.host, []);
        this.options.assumeInteractionOn.forEach((event) => {
          this.host.addEventListener(event, this.handleInteraction);
        });
      }
      hostDisconnected() {
        this.detachForm();
        interactions.delete(this.host);
        this.options.assumeInteractionOn.forEach((event) => {
          this.host.removeEventListener(event, this.handleInteraction);
        });
      }
      hostUpdated() {
        const form = this.options.form(this.host);
        if (!form) {
          this.detachForm();
        }
        if (form && this.form !== form) {
          this.detachForm();
          this.attachForm(form);
        }
        if (this.host.hasUpdated) {
          this.setValidity(this.host.validity.valid);
        }
      }
      attachForm(form) {
        if (form) {
          this.form = form;
          if (formCollections.has(this.form)) {
            formCollections.get(this.form).add(this.host);
          } else {
            formCollections.set(this.form, /* @__PURE__ */ new Set([this.host]));
          }
          this.form.addEventListener("formdata", this.handleFormData);
          this.form.addEventListener("submit", this.handleFormSubmit);
          this.form.addEventListener("reset", this.handleFormReset);
          if (!reportValidityOverloads.has(this.form)) {
            reportValidityOverloads.set(this.form, this.form.reportValidity);
            this.form.reportValidity = () => this.reportFormValidity();
          }
          if (!checkValidityOverloads.has(this.form)) {
            checkValidityOverloads.set(this.form, this.form.checkValidity);
            this.form.checkValidity = () => this.checkFormValidity();
          }
        } else {
          this.form = void 0;
        }
      }
      detachForm() {
        if (!this.form)
          return;
        const formCollection = formCollections.get(this.form);
        if (!formCollection) {
          return;
        }
        formCollection.delete(this.host);
        if (formCollection.size <= 0) {
          this.form.removeEventListener("formdata", this.handleFormData);
          this.form.removeEventListener("submit", this.handleFormSubmit);
          this.form.removeEventListener("reset", this.handleFormReset);
          if (reportValidityOverloads.has(this.form)) {
            this.form.reportValidity = reportValidityOverloads.get(this.form);
            reportValidityOverloads.delete(this.form);
          }
          if (checkValidityOverloads.has(this.form)) {
            this.form.checkValidity = checkValidityOverloads.get(this.form);
            checkValidityOverloads.delete(this.form);
          }
          this.form = void 0;
        }
      }
      setUserInteracted(el, hasInteracted) {
        if (hasInteracted) {
          userInteractedControls.add(el);
        } else {
          userInteractedControls.delete(el);
        }
        el.requestUpdate();
      }
      doAction(type5, submitter) {
        if (this.form) {
          const button = document.createElement("button");
          button.type = type5;
          button.style.position = "absolute";
          button.style.width = "0";
          button.style.height = "0";
          button.style.clipPath = "inset(50%)";
          button.style.overflow = "hidden";
          button.style.whiteSpace = "nowrap";
          if (submitter) {
            button.name = submitter.name;
            button.value = submitter.value;
            ["formaction", "formenctype", "formmethod", "formnovalidate", "formtarget"].forEach((attr) => {
              if (submitter.hasAttribute(attr)) {
                button.setAttribute(attr, submitter.getAttribute(attr));
              }
            });
          }
          this.form.append(button);
          button.click();
          button.remove();
        }
      }
      /** Returns the associated `<form>` element, if one exists. */
      getForm() {
        var _a;
        return (_a = this.form) != null ? _a : null;
      }
      /** Resets the form, restoring all the control to their default value */
      reset(submitter) {
        this.doAction("reset", submitter);
      }
      /** Submits the form, triggering validation and form data injection. */
      submit(submitter) {
        this.doAction("submit", submitter);
      }
      /**
       * Synchronously sets the form control's validity. Call this when you know the future validity but need to update
       * the host element immediately, i.e. before Lit updates the component in the next update.
       */
      setValidity(isValid) {
        const host = this.host;
        const hasInteracted = Boolean(userInteractedControls.has(host));
        const required = Boolean(host.required);
        host.toggleAttribute("data-required", required);
        host.toggleAttribute("data-optional", !required);
        host.toggleAttribute("data-invalid", !isValid);
        host.toggleAttribute("data-valid", isValid);
        host.toggleAttribute("data-user-invalid", !isValid && hasInteracted);
        host.toggleAttribute("data-user-valid", isValid && hasInteracted);
      }
      /**
       * Updates the form control's validity based on the current value of `host.validity.valid`. Call this when anything
       * that affects constraint validation changes so the component receives the correct validity states.
       */
      updateValidity() {
        const host = this.host;
        this.setValidity(host.validity.valid);
      }
      /**
       * Dispatches a non-bubbling, cancelable custom event of type `sl-invalid`.
       * If the `sl-invalid` event will be cancelled then the original `invalid`
       * event (which may have been passed as argument) will also be cancelled.
       * If no original `invalid` event has been passed then the `sl-invalid`
       * event will be cancelled before being dispatched.
       */
      emitInvalidEvent(originalInvalidEvent) {
        const slInvalidEvent = new CustomEvent("sl-invalid", {
          bubbles: false,
          composed: false,
          cancelable: true,
          detail: {}
        });
        if (!originalInvalidEvent) {
          slInvalidEvent.preventDefault();
        }
        if (!this.host.dispatchEvent(slInvalidEvent)) {
          originalInvalidEvent == null ? void 0 : originalInvalidEvent.preventDefault();
        }
      }
    };
    validValidityState = Object.freeze({
      badInput: false,
      customError: false,
      patternMismatch: false,
      rangeOverflow: false,
      rangeUnderflow: false,
      stepMismatch: false,
      tooLong: false,
      tooShort: false,
      typeMismatch: false,
      valid: true,
      valueMissing: false
    });
    valueMissingValidityState = Object.freeze(__spreadProps(__spreadValues({}, validValidityState), {
      valid: false,
      valueMissing: true
    }));
    customErrorValidityState = Object.freeze(__spreadProps(__spreadValues({}, validValidityState), {
      valid: false,
      customError: true
    }));
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.MAQXLKQ7.js
var button_styles_default;
var init_chunk_MAQXLKQ7 = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.MAQXLKQ7.js"() {
    init_lit();
    button_styles_default = i`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  .button {
    display: inline-flex;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    border-style: solid;
    border-width: var(--sl-input-border-width);
    font-family: var(--sl-input-font-family);
    font-weight: var(--sl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    padding: 0;
    transition:
      var(--sl-transition-x-fast) background-color,
      var(--sl-transition-x-fast) color,
      var(--sl-transition-x-fast) border,
      var(--sl-transition-x-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--sl-focus-ring);
    outline-offset: var(--sl-focus-ring-offset);
  }

  .button--disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__prefix,
  .button__suffix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    pointer-events: none;
  }

  .button__label {
    display: inline-block;
  }

  .button__label::slotted(sl-icon) {
    vertical-align: -2px;
  }

  /*
   * Standard buttons
   */

  /* Default */
  .button--standard.button--default {
    background-color: var(--sl-color-neutral-0);
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--standard.button--default:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-50);
    border-color: var(--sl-color-primary-300);
    color: var(--sl-color-primary-700);
  }

  .button--standard.button--default:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-100);
    border-color: var(--sl-color-primary-400);
    color: var(--sl-color-primary-700);
  }

  /* Primary */
  .button--standard.button--primary {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:hover:not(.button--disabled) {
    background-color: var(--sl-color-primary-500);
    border-color: var(--sl-color-primary-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--primary:active:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--standard.button--success {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:hover:not(.button--disabled) {
    background-color: var(--sl-color-success-500);
    border-color: var(--sl-color-success-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--success:active:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--standard.button--neutral {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:hover:not(.button--disabled) {
    background-color: var(--sl-color-neutral-500);
    border-color: var(--sl-color-neutral-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--neutral:active:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--standard.button--warning {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }
  .button--standard.button--warning:hover:not(.button--disabled) {
    background-color: var(--sl-color-warning-500);
    border-color: var(--sl-color-warning-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--warning:active:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--standard.button--danger {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:hover:not(.button--disabled) {
    background-color: var(--sl-color-danger-500);
    border-color: var(--sl-color-danger-500);
    color: var(--sl-color-neutral-0);
  }

  .button--standard.button--danger:active:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  /*
   * Outline buttons
   */

  .button--outline {
    background: none;
    border: solid 1px;
  }

  /* Default */
  .button--outline.button--default {
    border-color: var(--sl-input-border-color);
    color: var(--sl-color-neutral-700);
  }

  .button--outline.button--default:hover:not(.button--disabled),
  .button--outline.button--default.button--checked:not(.button--disabled) {
    border-color: var(--sl-color-primary-600);
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--default:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Primary */
  .button--outline.button--primary {
    border-color: var(--sl-color-primary-600);
    color: var(--sl-color-primary-600);
  }

  .button--outline.button--primary:hover:not(.button--disabled),
  .button--outline.button--primary.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-primary-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--primary:active:not(.button--disabled) {
    border-color: var(--sl-color-primary-700);
    background-color: var(--sl-color-primary-700);
    color: var(--sl-color-neutral-0);
  }

  /* Success */
  .button--outline.button--success {
    border-color: var(--sl-color-success-600);
    color: var(--sl-color-success-600);
  }

  .button--outline.button--success:hover:not(.button--disabled),
  .button--outline.button--success.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-success-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--success:active:not(.button--disabled) {
    border-color: var(--sl-color-success-700);
    background-color: var(--sl-color-success-700);
    color: var(--sl-color-neutral-0);
  }

  /* Neutral */
  .button--outline.button--neutral {
    border-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-600);
  }

  .button--outline.button--neutral:hover:not(.button--disabled),
  .button--outline.button--neutral.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-neutral-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--neutral:active:not(.button--disabled) {
    border-color: var(--sl-color-neutral-700);
    background-color: var(--sl-color-neutral-700);
    color: var(--sl-color-neutral-0);
  }

  /* Warning */
  .button--outline.button--warning {
    border-color: var(--sl-color-warning-600);
    color: var(--sl-color-warning-600);
  }

  .button--outline.button--warning:hover:not(.button--disabled),
  .button--outline.button--warning.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-warning-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--warning:active:not(.button--disabled) {
    border-color: var(--sl-color-warning-700);
    background-color: var(--sl-color-warning-700);
    color: var(--sl-color-neutral-0);
  }

  /* Danger */
  .button--outline.button--danger {
    border-color: var(--sl-color-danger-600);
    color: var(--sl-color-danger-600);
  }

  .button--outline.button--danger:hover:not(.button--disabled),
  .button--outline.button--danger.button--checked:not(.button--disabled) {
    background-color: var(--sl-color-danger-600);
    color: var(--sl-color-neutral-0);
  }

  .button--outline.button--danger:active:not(.button--disabled) {
    border-color: var(--sl-color-danger-700);
    background-color: var(--sl-color-danger-700);
    color: var(--sl-color-neutral-0);
  }

  @media (forced-colors: active) {
    .button.button--outline.button--checked:not(.button--disabled) {
      outline: solid 2px transparent;
    }
  }

  /*
   * Text buttons
   */

  .button--text {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-600);
  }

  .button--text:hover:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:focus-visible:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-500);
  }

  .button--text:active:not(.button--disabled) {
    background-color: transparent;
    border-color: transparent;
    color: var(--sl-color-primary-700);
  }

  /*
   * Size modifiers
   */

  .button--small {
    height: auto;
    min-height: var(--sl-input-height-small);
    font-size: var(--sl-button-font-size-small);
    line-height: calc(var(--sl-input-height-small) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-small);
  }

  .button--medium {
    height: auto;
    min-height: var(--sl-input-height-medium);
    font-size: var(--sl-button-font-size-medium);
    line-height: calc(var(--sl-input-height-medium) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-medium);
  }

  .button--large {
    height: auto;
    min-height: var(--sl-input-height-large);
    font-size: var(--sl-button-font-size-large);
    line-height: calc(var(--sl-input-height-large) - var(--sl-input-border-width) * 2);
    border-radius: var(--sl-input-border-radius-large);
  }

  /*
   * Pill modifier
   */

  .button--pill.button--small {
    border-radius: var(--sl-input-height-small);
  }

  .button--pill.button--medium {
    border-radius: var(--sl-input-height-medium);
  }

  .button--pill.button--large {
    border-radius: var(--sl-input-height-large);
  }

  /*
   * Circle modifier
   */

  .button--circle {
    padding-left: 0;
    padding-right: 0;
  }

  .button--circle.button--small {
    width: var(--sl-input-height-small);
    border-radius: 50%;
  }

  .button--circle.button--medium {
    width: var(--sl-input-height-medium);
    border-radius: 50%;
  }

  .button--circle.button--large {
    width: var(--sl-input-height-large);
    border-radius: 50%;
  }

  .button--circle .button__prefix,
  .button--circle .button__suffix,
  .button--circle .button__caret {
    display: none;
  }

  /*
   * Caret modifier
   */

  .button--caret .button__suffix {
    display: none;
  }

  .button--caret .button__caret {
    height: auto;
  }

  /*
   * Loading modifier
   */

  .button--loading {
    position: relative;
    cursor: wait;
  }

  .button--loading .button__prefix,
  .button--loading .button__label,
  .button--loading .button__suffix,
  .button--loading .button__caret {
    visibility: hidden;
  }

  .button--loading sl-spinner {
    --indicator-color: currentColor;
    position: absolute;
    font-size: 1em;
    height: 1em;
    width: 1em;
    top: calc(50% - 0.5em);
    left: calc(50% - 0.5em);
  }

  /*
   * Badges
   */

  .button ::slotted(sl-badge) {
    position: absolute;
    top: 0;
    right: 0;
    translate: 50% -50%;
    pointer-events: none;
  }

  .button--rtl ::slotted(sl-badge) {
    right: auto;
    left: 0;
    translate: -50% -50%;
  }

  /*
   * Button spacing
   */

  .button--has-label.button--small .button__label {
    padding: 0 var(--sl-spacing-small);
  }

  .button--has-label.button--medium .button__label {
    padding: 0 var(--sl-spacing-medium);
  }

  .button--has-label.button--large .button__label {
    padding: 0 var(--sl-spacing-large);
  }

  .button--has-prefix.button--small {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--small .button__label {
    padding-inline-start: var(--sl-spacing-x-small);
  }

  .button--has-prefix.button--medium {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--medium .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-prefix.button--large .button__label {
    padding-inline-start: var(--sl-spacing-small);
  }

  .button--has-suffix.button--small,
  .button--caret.button--small {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--small .button__label,
  .button--caret.button--small .button__label {
    padding-inline-end: var(--sl-spacing-x-small);
  }

  .button--has-suffix.button--medium,
  .button--caret.button--medium {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--medium .button__label,
  .button--caret.button--medium .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large,
  .button--caret.button--large {
    padding-inline-end: var(--sl-spacing-small);
  }

  .button--has-suffix.button--large .button__label,
  .button--caret.button--large .button__label {
    padding-inline-end: var(--sl-spacing-small);
  }

  /*
   * Button groups support a variety of button types (e.g. buttons with tooltips, buttons as dropdown triggers, etc.).
   * This means buttons aren't always direct descendants of the button group, thus we can't target them with the
   * ::slotted selector. To work around this, the button group component does some magic to add these special classes to
   * buttons and we style them here instead.
   */

  :host([data-sl-button-group__button--first]:not([data-sl-button-group__button--last])) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-sl-button-group__button--inner]) .button {
    border-radius: 0;
  }

  :host([data-sl-button-group__button--last]:not([data-sl-button-group__button--first])) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-sl-button-group__button]:not([data-sl-button-group__button--first])) {
    margin-inline-start: calc(-1 * var(--sl-input-border-width));
  }

  /* Add a visual separator between solid buttons */
  :host(
      [data-sl-button-group__button]:not(
          [data-sl-button-group__button--first],
          [data-sl-button-group__button--radio],
          [variant='default']
        ):not(:hover)
    )
    .button:after {
    content: '';
    position: absolute;
    top: 0;
    inset-inline-start: 0;
    bottom: 0;
    border-left: solid 1px rgb(128 128 128 / 33%);
    mix-blend-mode: multiply;
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-sl-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-sl-button-group__button--focus]),
  :host([data-sl-button-group__button][checked]) {
    z-index: 2;
  }
`;
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/static.js
var a3, o9, i6, l3, n7, u3, c5, $2;
var init_static = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/static.js"() {
    init_lit_html();
    a3 = Symbol.for("");
    o9 = (t6) => {
      if (t6?.r === a3) return t6?._$litStatic$;
    };
    i6 = (t6, ...r9) => ({ _$litStatic$: r9.reduce((r10, e10, a4) => r10 + ((t7) => {
      if (void 0 !== t7._$litStatic$) return t7._$litStatic$;
      throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t7}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`);
    })(e10) + t6[a4 + 1], t6[0]), r: a3 });
    l3 = /* @__PURE__ */ new Map();
    n7 = (t6) => (r9, ...e10) => {
      const a4 = e10.length;
      let s4, i7;
      const n8 = [], u4 = [];
      let c6, $3 = 0, f5 = false;
      for (; $3 < a4; ) {
        for (c6 = r9[$3]; $3 < a4 && void 0 !== (i7 = e10[$3], s4 = o9(i7)); ) c6 += s4 + r9[++$3], f5 = true;
        $3 !== a4 && u4.push(i7), n8.push(c6), $3++;
      }
      if ($3 === a4 && n8.push(r9[a4]), f5) {
        const t7 = n8.join("$$lit$$");
        void 0 === (r9 = l3.get(t7)) && (n8.raw = n8, l3.set(t7, r9 = n8)), e10 = u4;
      }
      return t6(r9, ...e10);
    };
    u3 = n7(x);
    c5 = n7(b2);
    $2 = n7(w);
  }
});

// node_modules/.pnpm/lit@3.2.1/node_modules/lit/static-html.js
var init_static_html = __esm({
  "node_modules/.pnpm/lit@3.2.1/node_modules/lit/static-html.js"() {
    init_static();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.N2SNE3QN.js
var SlButton;
var init_chunk_N2SNE3QN = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.N2SNE3QN.js"() {
    init_chunk_TLKDQ5JG();
    init_chunk_2RCF7SLU();
    init_chunk_MAQXLKQ7();
    init_chunk_WLV3FVBR();
    init_chunk_NYIIDP5N();
    init_chunk_E6QAPUBK();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
    init_class_map2();
    init_static_html();
    init_if_defined2();
    init_decorators();
    SlButton = class extends ShoelaceElement {
      constructor() {
        super(...arguments);
        this.formControlController = new FormControlController(this, {
          assumeInteractionOn: ["click"]
        });
        this.hasSlotController = new HasSlotController(this, "[default]", "prefix", "suffix");
        this.localize = new LocalizeController2(this);
        this.hasFocus = false;
        this.invalid = false;
        this.title = "";
        this.variant = "default";
        this.size = "medium";
        this.caret = false;
        this.disabled = false;
        this.loading = false;
        this.outline = false;
        this.pill = false;
        this.circle = false;
        this.type = "button";
        this.name = "";
        this.value = "";
        this.href = "";
        this.rel = "noreferrer noopener";
      }
      /** Gets the validity state object */
      get validity() {
        if (this.isButton()) {
          return this.button.validity;
        }
        return validValidityState;
      }
      /** Gets the validation message */
      get validationMessage() {
        if (this.isButton()) {
          return this.button.validationMessage;
        }
        return "";
      }
      firstUpdated() {
        if (this.isButton()) {
          this.formControlController.updateValidity();
        }
      }
      handleBlur() {
        this.hasFocus = false;
        this.emit("sl-blur");
      }
      handleFocus() {
        this.hasFocus = true;
        this.emit("sl-focus");
      }
      handleClick() {
        if (this.type === "submit") {
          this.formControlController.submit(this);
        }
        if (this.type === "reset") {
          this.formControlController.reset(this);
        }
      }
      handleInvalid(event) {
        this.formControlController.setValidity(false);
        this.formControlController.emitInvalidEvent(event);
      }
      isButton() {
        return this.href ? false : true;
      }
      isLink() {
        return this.href ? true : false;
      }
      handleDisabledChange() {
        if (this.isButton()) {
          this.formControlController.setValidity(this.disabled);
        }
      }
      /** Simulates a click on the button. */
      click() {
        this.button.click();
      }
      /** Sets focus on the button. */
      focus(options) {
        this.button.focus(options);
      }
      /** Removes focus from the button. */
      blur() {
        this.button.blur();
      }
      /** Checks for validity but does not show a validation message. Returns `true` when valid and `false` when invalid. */
      checkValidity() {
        if (this.isButton()) {
          return this.button.checkValidity();
        }
        return true;
      }
      /** Gets the associated form, if one exists. */
      getForm() {
        return this.formControlController.getForm();
      }
      /** Checks for validity and shows the browser's validation message if the control is invalid. */
      reportValidity() {
        if (this.isButton()) {
          return this.button.reportValidity();
        }
        return true;
      }
      /** Sets a custom validation message. Pass an empty string to restore validity. */
      setCustomValidity(message) {
        if (this.isButton()) {
          this.button.setCustomValidity(message);
          this.formControlController.updateValidity();
        }
      }
      render() {
        const isLink = this.isLink();
        const tag = isLink ? i6`a` : i6`button`;
        return u3`
      <${tag}
        part="base"
        class=${e7({
          button: true,
          "button--default": this.variant === "default",
          "button--primary": this.variant === "primary",
          "button--success": this.variant === "success",
          "button--neutral": this.variant === "neutral",
          "button--warning": this.variant === "warning",
          "button--danger": this.variant === "danger",
          "button--text": this.variant === "text",
          "button--small": this.size === "small",
          "button--medium": this.size === "medium",
          "button--large": this.size === "large",
          "button--caret": this.caret,
          "button--circle": this.circle,
          "button--disabled": this.disabled,
          "button--focused": this.hasFocus,
          "button--loading": this.loading,
          "button--standard": !this.outline,
          "button--outline": this.outline,
          "button--pill": this.pill,
          "button--rtl": this.localize.dir() === "rtl",
          "button--has-label": this.hasSlotController.test("[default]"),
          "button--has-prefix": this.hasSlotController.test("prefix"),
          "button--has-suffix": this.hasSlotController.test("suffix")
        })}
        ?disabled=${o5(isLink ? void 0 : this.disabled)}
        type=${o5(isLink ? void 0 : this.type)}
        title=${this.title}
        name=${o5(isLink ? void 0 : this.name)}
        value=${o5(isLink ? void 0 : this.value)}
        href=${o5(isLink && !this.disabled ? this.href : void 0)}
        target=${o5(isLink ? this.target : void 0)}
        download=${o5(isLink ? this.download : void 0)}
        rel=${o5(isLink ? this.rel : void 0)}
        role=${o5(isLink ? void 0 : "button")}
        aria-disabled=${this.disabled ? "true" : "false"}
        tabindex=${this.disabled ? "-1" : "0"}
        @blur=${this.handleBlur}
        @focus=${this.handleFocus}
        @invalid=${this.isButton() ? this.handleInvalid : null}
        @click=${this.handleClick}
      >
        <slot name="prefix" part="prefix" class="button__prefix"></slot>
        <slot part="label" class="button__label"></slot>
        <slot name="suffix" part="suffix" class="button__suffix"></slot>
        ${this.caret ? u3` <sl-icon part="caret" class="button__caret" library="system" name="caret"></sl-icon> ` : ""}
        ${this.loading ? u3`<sl-spinner part="spinner"></sl-spinner>` : ""}
      </${tag}>
    `;
      }
    };
    SlButton.styles = [component_styles_default, button_styles_default];
    SlButton.dependencies = {
      "sl-icon": SlIcon,
      "sl-spinner": SlSpinner
    };
    __decorateClass([
      e5(".button")
    ], SlButton.prototype, "button", 2);
    __decorateClass([
      r6()
    ], SlButton.prototype, "hasFocus", 2);
    __decorateClass([
      r6()
    ], SlButton.prototype, "invalid", 2);
    __decorateClass([
      n4()
    ], SlButton.prototype, "title", 2);
    __decorateClass([
      n4({ reflect: true })
    ], SlButton.prototype, "variant", 2);
    __decorateClass([
      n4({ reflect: true })
    ], SlButton.prototype, "size", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlButton.prototype, "caret", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlButton.prototype, "disabled", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlButton.prototype, "loading", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlButton.prototype, "outline", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlButton.prototype, "pill", 2);
    __decorateClass([
      n4({ type: Boolean, reflect: true })
    ], SlButton.prototype, "circle", 2);
    __decorateClass([
      n4()
    ], SlButton.prototype, "type", 2);
    __decorateClass([
      n4()
    ], SlButton.prototype, "name", 2);
    __decorateClass([
      n4()
    ], SlButton.prototype, "value", 2);
    __decorateClass([
      n4()
    ], SlButton.prototype, "href", 2);
    __decorateClass([
      n4()
    ], SlButton.prototype, "target", 2);
    __decorateClass([
      n4()
    ], SlButton.prototype, "rel", 2);
    __decorateClass([
      n4()
    ], SlButton.prototype, "download", 2);
    __decorateClass([
      n4()
    ], SlButton.prototype, "form", 2);
    __decorateClass([
      n4({ attribute: "formaction" })
    ], SlButton.prototype, "formAction", 2);
    __decorateClass([
      n4({ attribute: "formenctype" })
    ], SlButton.prototype, "formEnctype", 2);
    __decorateClass([
      n4({ attribute: "formmethod" })
    ], SlButton.prototype, "formMethod", 2);
    __decorateClass([
      n4({ attribute: "formnovalidate", type: Boolean })
    ], SlButton.prototype, "formNoValidate", 2);
    __decorateClass([
      n4({ attribute: "formtarget" })
    ], SlButton.prototype, "formTarget", 2);
    __decorateClass([
      watch("disabled", { waitUntilFirstUpdate: true })
    ], SlButton.prototype, "handleDisabledChange", 1);
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.Q6JS2LBD.js
var init_chunk_Q6JS2LBD = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.Q6JS2LBD.js"() {
    init_chunk_N2SNE3QN();
    SlButton.define("sl-button");
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/button/button.js
var init_button = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/button/button.js"() {
    init_chunk_Q6JS2LBD();
    init_chunk_N2SNE3QN();
    init_chunk_TLKDQ5JG();
    init_chunk_7DUCI5S4();
    init_chunk_2RCF7SLU();
    init_chunk_MAQXLKQ7();
    init_chunk_WLV3FVBR();
    init_chunk_MAS2SHYD();
    init_chunk_NYIIDP5N();
    init_chunk_E6QAPUBK();
    init_chunk_ZL53POKZ();
    init_chunk_P7ZG6EMR();
    init_chunk_3TFKS637();
    init_chunk_QLXRCYS4();
    init_chunk_3Y6SB6QS();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.HBPNMM7A.js
var init_chunk_HBPNMM7A = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.HBPNMM7A.js"() {
    init_chunk_E6QAPUBK();
    SlIcon.define("sl-icon");
  }
});

// node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/icon/icon.js
var init_icon = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/components/icon/icon.js"() {
    init_chunk_HBPNMM7A();
    init_chunk_E6QAPUBK();
    init_chunk_ZL53POKZ();
    init_chunk_P7ZG6EMR();
    init_chunk_3TFKS637();
    init_chunk_QLXRCYS4();
    init_chunk_3Y6SB6QS();
    init_chunk_CCJUT23E();
    init_chunk_TUVJKY7S();
    init_chunk_UYAO2JRR();
    init_chunk_B3BW2AY6();
  }
});

// src_web/gallery/imageWindow.ts
import { SessionStorageHelper } from "../common/storage.js";
import { JKImageGallery } from "./gallery.js";
import { FeedBarEvents } from "./feedBar.js";
var require_imageWindow = __commonJS({
  "src_web/gallery/imageWindow.ts"() {
    init_esbrowser();
    init_base_path();
    init_split_panel();
    init_spinner();
    init_badge();
    init_details();
    init_dropdown();
    init_menu();
    init_menu_item();
    init_button();
    init_icon();
    setBasePath("../../node_modules/@shoelace-style/shoelace/dist");
    var channel = new BroadcastChannel2("jk-image-viewer");
    var IS_FEED_WINDOW = !!window.jkImageWindow;
    if (IS_FEED_WINDOW) {
      const Gallery = new JKImageGallery(document.getElementById("jk-image-gallery"), document.getElementById("jk-feed-bar"));
      const init = async () => {
        await Gallery.init();
      };
      Gallery.addEventListener(FeedBarEvents["feed-clear"], (ev) => {
        SessionStorageHelper.setJSONVal("feed", []);
        channel.postMessage({ data: void 0, type: "clear-feed" });
      });
      channel.addEventListener("message", async (m2) => {
        switch (m2.type) {
          case "heartbeat":
            break;
          case "new-image":
            Gallery.addImage(m2.data, true);
            break;
          case "request-all":
            await init();
            await Gallery.addImages(m2.data.images);
            for (const [key, value] of Object.entries(m2.data.cssVars)) {
              document.documentElement.style.setProperty(key, value);
            }
        }
      });
      channel.postMessage({ type: "request-all", data: { images: [], cssVars: {} } });
    } else {
      let CURRENT_IMAGES = SessionStorageHelper.getJSON("feed") ?? [];
      const setup = async () => {
        const sendImageToFeed = (data) => {
          CURRENT_IMAGES.push(data);
          SessionStorageHelper.setJSONVal("feed", CURRENT_IMAGES);
          channel.postMessage({ type: "new-image", data });
        };
        const { api } = await import("../../../../scripts/api.js");
        const { app } = await import("../../../../scripts/app.js");
        const { $el } = await import("../../../../scripts/ui.js");
        let feedWindow = null;
        const { getElementCSSVariables } = await import("../common/utils.js");
        const toggleWindow = () => {
          const isOpen = feedWindow ? !feedWindow.closed : false;
          if (isOpen) {
            feedWindow?.close();
            feedWindow = null;
          } else {
            feedWindow = window.open(
              `/extensions/comfyui-jk-easy-nodes/gallery/jk-image-window.html`,
              `_blank`,
              `width=1280,height=720,location=no,toolbar=no,menubar=no`
            );
            feedWindow.comfyAPI = window.comfyAPI;
          }
          window.addEventListener("beforeunload", (e10) => {
            feedWindow?.close();
          });
        };
        channel.addEventListener("message", (m2) => {
          switch (m2.type) {
            case "request-all":
              if (feedWindow) {
                feedWindow.comfyAPI = window.comfyAPI;
                document.querySelectorAll("link, style").forEach((htmlElement) => {
                  const cloned = htmlElement.cloneNode(true);
                  if (cloned.href) {
                    cloned.href = cloned.href.replace(
                      window.location.protocol + "//" + window.location.host,
                      ""
                    );
                  }
                  feedWindow.document.head.appendChild(cloned);
                });
                const comfyCssVars = getElementCSSVariables();
                channel.postMessage({ type: "request-all", data: { images: CURRENT_IMAGES, cssVars: comfyCssVars } });
              }
              break;
            case "closed":
              console.log("feed window was closed");
              feedWindow = null;
              break;
            case "clear-feed":
              SessionStorageHelper.setJSONVal("feed", []);
              CURRENT_IMAGES = [];
          }
        });
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
            window.dispatchEvent(new Event("resize"));
            app.menu.settingsGroup.append(showMenuButton);
            let startTime = /* @__PURE__ */ new Date();
            api.addEventListener("execution_start", () => {
              startTime = /* @__PURE__ */ new Date();
            });
            api.addEventListener("executed", ({ detail }) => {
              const execTimeMs = (/* @__PURE__ */ new Date()).getTime() - startTime.getTime();
              const nodeId = parseInt(detail.node, 10);
              const node = app.graph.getNodeById(nodeId);
              const title = node.title;
              if (detail?.output?.images) {
                if (detail.node?.includes?.(":")) {
                  const n8 = app.graph.getNodeById(detail.node.split(":")[0]);
                  if (n8?.getInnerNodes) return;
                }
                detail.output.images.forEach((src) => {
                  const href = `/view?filename=${encodeURIComponent(src.filename)}&type=${src.type}&subfolder=${encodeURIComponent(
                    src.subfolder
                  )}&t=${+/* @__PURE__ */ new Date()}`;
                  const deduplicateFeed = true;
                  if (deduplicateFeed) {
                    const fingerprint = JSON.stringify({ filename: src.filename, type: src.type, subfolder: src.subfolder });
                    if (seenImages.has(fingerprint)) {
                    } else {
                      seenImages.set(fingerprint, true);
                      sendImageToFeed({
                        href,
                        subfolder: src.subfolder,
                        type: src.type,
                        nodeId,
                        nodeTitle: title,
                        fileName: src.filename,
                        execTimeMs
                      });
                    }
                  } else {
                    sendImageToFeed({
                      href,
                      subfolder: src.subfolder,
                      type: src.type,
                      nodeId,
                      nodeTitle: title,
                      fileName: src.filename,
                      execTimeMs
                    });
                  }
                });
              }
            });
          }
        });
      };
      setup();
    }
  }
});
export default require_imageWindow();
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

lit-html/directives/if-defined.js:
  (**
   * @license
   * Copyright 2018 Google LLC
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

lit-html/directive-helpers.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/async-directive.js:
  (**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/directives/ref.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)

lit-html/static.js:
  (**
   * @license
   * Copyright 2020 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   *)
*/
