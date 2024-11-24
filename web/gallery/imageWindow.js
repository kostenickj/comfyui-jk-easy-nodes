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
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
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
      getAllRequest.onsuccess = function(e) {
        res(e.target.result);
      };
    });
  }
  function openCursor() {
    try {
      keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
      return objectStore.openCursor(keyRangeValue);
    } catch (e) {
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
  } catch (e) {
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
  } catch (e) {
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
    var ret = chooseMethods.find(function(m) {
      return m.type === options.type;
    });
    if (!ret) throw new Error("method-type " + options.type + " not found");
    else return ret;
  }
  if (!options.webWorkerSupport) {
    chooseMethods = chooseMethods.filter(function(m) {
      return m.type !== "idb";
    });
  }
  var useMethod = chooseMethods.find(function(method) {
    return method.canBeUsed();
  });
  if (!useMethod) {
    throw new Error("No usable method found in " + JSON.stringify(METHODS.map(function(m) {
      return m.type;
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
    maybePromise.then(function(s) {
      channel._state = s;
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
  channel._addEL[type5] = channel._addEL[type5].filter(function(o) {
    return o !== obj;
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

// src_web/gallery/imageWindow.ts
import { SessionStorageHelper } from "../common/storage.js";
import { JKImageGallery } from "./gallery.js";
var require_imageWindow = __commonJS({
  "src_web/gallery/imageWindow.ts"() {
    init_esbrowser();
    var channel = new BroadcastChannel2("jk-image-viewer");
    var IS_FEED_WINDOW = !!window.jkImageWindow;
    if (IS_FEED_WINDOW) {
      const Gallery = new JKImageGallery(document.getElementById("jk-image-gallery"), document.getElementById("jk-feed-bar"));
      const init = async () => {
        await Gallery.init();
      };
      channel.addEventListener("message", async (m) => {
        switch (m.type) {
          case "heartbeat":
            break;
          case "new-image":
            Gallery.addImage(m.data);
            break;
          case "request-all":
            await init();
            await Gallery.addImages(m.data.images);
            for (const [key, value] of Object.entries(m.data.cssVars)) {
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
          window.addEventListener("beforeunload", (e) => {
            feedWindow?.close();
          });
        };
        channel.addEventListener("message", (m) => {
          switch (m.type) {
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
                  const n = app.graph.getNodeById(detail.node.split(":")[0]);
                  if (n?.getInnerNodes) return;
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
                      let img = $el("img", { src: href });
                      img.onload = () => {
                        let imgCanvas = document.createElement("canvas");
                        let imgScalar = 1;
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
                      };
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
