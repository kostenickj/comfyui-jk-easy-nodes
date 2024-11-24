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
      getAllRequest.onsuccess = function(e9) {
        res(e9.target.result);
      };
    });
  }
  function openCursor() {
    try {
      keyRangeValue = IDBKeyRange.bound(lastCursorId + 1, Infinity);
      return objectStore.openCursor(keyRangeValue);
    } catch (e9) {
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
  } catch (e9) {
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
  } catch (e9) {
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
    maybePromise.then(function(s3) {
      channel._state = s3;
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
  channel._addEL[type5] = channel._addEL[type5].filter(function(o6) {
    return o6 !== obj;
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
      const fallbackScript = scripts.find((s3) => {
        return /shoelace(\.min)?\.js($|\?)/.test(s3.src) || /shoelace-autoloader(\.min)?\.js($|\?)/.test(s3.src);
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
    __spreadValues = (a3, b3) => {
      for (var prop in b3 || (b3 = {}))
        if (__hasOwnProp.call(b3, prop))
          __defNormalProp2(a3, prop, b3[prop]);
      if (__getOwnPropSymbols)
        for (var prop of __getOwnPropSymbols(b3)) {
          if (__propIsEnum.call(b3, prop))
            __defNormalProp2(a3, prop, b3[prop]);
        }
      return a3;
    };
    __spreadProps = (a3, b3) => __defProps(a3, __getOwnPropDescs(b3));
    __decorateClass = (decorators, target, key, kind) => {
      var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
      for (var i6 = decorators.length - 1, decorator; i6 >= 0; i6--)
        if (decorator = decorators[i6])
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
      constructor(t5, e9, o6) {
        if (this._$cssResult$ = true, o6 !== s) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
        this.cssText = t5, this.t = e9;
      }
      get styleSheet() {
        let t5 = this.o;
        const s3 = this.t;
        if (e && void 0 === t5) {
          const e9 = void 0 !== s3 && 1 === s3.length;
          e9 && (t5 = o.get(s3)), void 0 === t5 && ((this.o = t5 = new CSSStyleSheet()).replaceSync(this.cssText), e9 && o.set(s3, t5));
        }
        return t5;
      }
      toString() {
        return this.cssText;
      }
    };
    r = (t5) => new n("string" == typeof t5 ? t5 : t5 + "", void 0, s);
    i = (t5, ...e9) => {
      const o6 = 1 === t5.length ? t5[0] : e9.reduce((e10, s3, o7) => e10 + ((t6) => {
        if (true === t6._$cssResult$) return t6.cssText;
        if ("number" == typeof t6) return t6;
        throw Error("Value passed to 'css' function must be a 'css' function result: " + t6 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
      })(s3) + t5[o7 + 1], t5[0]);
      return new n(o6, t5, s);
    };
    S = (s3, o6) => {
      if (e) s3.adoptedStyleSheets = o6.map((t5) => t5 instanceof CSSStyleSheet ? t5 : t5.styleSheet);
      else for (const e9 of o6) {
        const o7 = document.createElement("style"), n5 = t.litNonce;
        void 0 !== n5 && o7.setAttribute("nonce", n5), o7.textContent = e9.cssText, s3.appendChild(o7);
      }
    };
    c = e ? (t5) => t5 : (t5) => t5 instanceof CSSStyleSheet ? ((t6) => {
      let e9 = "";
      for (const s3 of t6.cssRules) e9 += s3.cssText;
      return r(e9);
    })(t5) : t5;
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
    d = (t5, s3) => t5;
    u = { toAttribute(t5, s3) {
      switch (s3) {
        case Boolean:
          t5 = t5 ? l : null;
          break;
        case Object:
        case Array:
          t5 = null == t5 ? t5 : JSON.stringify(t5);
      }
      return t5;
    }, fromAttribute(t5, s3) {
      let i6 = t5;
      switch (s3) {
        case Boolean:
          i6 = null !== t5;
          break;
        case Number:
          i6 = null === t5 ? null : Number(t5);
          break;
        case Object:
        case Array:
          try {
            i6 = JSON.parse(t5);
          } catch (t6) {
            i6 = null;
          }
      }
      return i6;
    } };
    f = (t5, s3) => !i2(t5, s3);
    y = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
    Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a.litPropertyMetadata ?? (a.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
    b = class extends HTMLElement {
      static addInitializer(t5) {
        this._$Ei(), (this.l ?? (this.l = [])).push(t5);
      }
      static get observedAttributes() {
        return this.finalize(), this._$Eh && [...this._$Eh.keys()];
      }
      static createProperty(t5, s3 = y) {
        if (s3.state && (s3.attribute = false), this._$Ei(), this.elementProperties.set(t5, s3), !s3.noAccessor) {
          const i6 = Symbol(), r7 = this.getPropertyDescriptor(t5, i6, s3);
          void 0 !== r7 && e2(this.prototype, t5, r7);
        }
      }
      static getPropertyDescriptor(t5, s3, i6) {
        const { get: e9, set: h3 } = r2(this.prototype, t5) ?? { get() {
          return this[s3];
        }, set(t6) {
          this[s3] = t6;
        } };
        return { get() {
          return e9?.call(this);
        }, set(s4) {
          const r7 = e9?.call(this);
          h3.call(this, s4), this.requestUpdate(t5, r7, i6);
        }, configurable: true, enumerable: true };
      }
      static getPropertyOptions(t5) {
        return this.elementProperties.get(t5) ?? y;
      }
      static _$Ei() {
        if (this.hasOwnProperty(d("elementProperties"))) return;
        const t5 = n2(this);
        t5.finalize(), void 0 !== t5.l && (this.l = [...t5.l]), this.elementProperties = new Map(t5.elementProperties);
      }
      static finalize() {
        if (this.hasOwnProperty(d("finalized"))) return;
        if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d("properties"))) {
          const t6 = this.properties, s3 = [...h(t6), ...o2(t6)];
          for (const i6 of s3) this.createProperty(i6, t6[i6]);
        }
        const t5 = this[Symbol.metadata];
        if (null !== t5) {
          const s3 = litPropertyMetadata.get(t5);
          if (void 0 !== s3) for (const [t6, i6] of s3) this.elementProperties.set(t6, i6);
        }
        this._$Eh = /* @__PURE__ */ new Map();
        for (const [t6, s3] of this.elementProperties) {
          const i6 = this._$Eu(t6, s3);
          void 0 !== i6 && this._$Eh.set(i6, t6);
        }
        this.elementStyles = this.finalizeStyles(this.styles);
      }
      static finalizeStyles(s3) {
        const i6 = [];
        if (Array.isArray(s3)) {
          const e9 = new Set(s3.flat(1 / 0).reverse());
          for (const s4 of e9) i6.unshift(c(s4));
        } else void 0 !== s3 && i6.push(c(s3));
        return i6;
      }
      static _$Eu(t5, s3) {
        const i6 = s3.attribute;
        return false === i6 ? void 0 : "string" == typeof i6 ? i6 : "string" == typeof t5 ? t5.toLowerCase() : void 0;
      }
      constructor() {
        super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
      }
      _$Ev() {
        this._$ES = new Promise((t5) => this.enableUpdating = t5), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t5) => t5(this));
      }
      addController(t5) {
        (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t5), void 0 !== this.renderRoot && this.isConnected && t5.hostConnected?.();
      }
      removeController(t5) {
        this._$EO?.delete(t5);
      }
      _$E_() {
        const t5 = /* @__PURE__ */ new Map(), s3 = this.constructor.elementProperties;
        for (const i6 of s3.keys()) this.hasOwnProperty(i6) && (t5.set(i6, this[i6]), delete this[i6]);
        t5.size > 0 && (this._$Ep = t5);
      }
      createRenderRoot() {
        const t5 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
        return S(t5, this.constructor.elementStyles), t5;
      }
      connectedCallback() {
        this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), this._$EO?.forEach((t5) => t5.hostConnected?.());
      }
      enableUpdating(t5) {
      }
      disconnectedCallback() {
        this._$EO?.forEach((t5) => t5.hostDisconnected?.());
      }
      attributeChangedCallback(t5, s3, i6) {
        this._$AK(t5, i6);
      }
      _$EC(t5, s3) {
        const i6 = this.constructor.elementProperties.get(t5), e9 = this.constructor._$Eu(t5, i6);
        if (void 0 !== e9 && true === i6.reflect) {
          const r7 = (void 0 !== i6.converter?.toAttribute ? i6.converter : u).toAttribute(s3, i6.type);
          this._$Em = t5, null == r7 ? this.removeAttribute(e9) : this.setAttribute(e9, r7), this._$Em = null;
        }
      }
      _$AK(t5, s3) {
        const i6 = this.constructor, e9 = i6._$Eh.get(t5);
        if (void 0 !== e9 && this._$Em !== e9) {
          const t6 = i6.getPropertyOptions(e9), r7 = "function" == typeof t6.converter ? { fromAttribute: t6.converter } : void 0 !== t6.converter?.fromAttribute ? t6.converter : u;
          this._$Em = e9, this[e9] = r7.fromAttribute(s3, t6.type), this._$Em = null;
        }
      }
      requestUpdate(t5, s3, i6) {
        if (void 0 !== t5) {
          if (i6 ?? (i6 = this.constructor.getPropertyOptions(t5)), !(i6.hasChanged ?? f)(this[t5], s3)) return;
          this.P(t5, s3, i6);
        }
        false === this.isUpdatePending && (this._$ES = this._$ET());
      }
      P(t5, s3, i6) {
        this._$AL.has(t5) || this._$AL.set(t5, s3), true === i6.reflect && this._$Em !== t5 && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t5);
      }
      async _$ET() {
        this.isUpdatePending = true;
        try {
          await this._$ES;
        } catch (t6) {
          Promise.reject(t6);
        }
        const t5 = this.scheduleUpdate();
        return null != t5 && await t5, !this.isUpdatePending;
      }
      scheduleUpdate() {
        return this.performUpdate();
      }
      performUpdate() {
        if (!this.isUpdatePending) return;
        if (!this.hasUpdated) {
          if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
            for (const [t7, s4] of this._$Ep) this[t7] = s4;
            this._$Ep = void 0;
          }
          const t6 = this.constructor.elementProperties;
          if (t6.size > 0) for (const [s4, i6] of t6) true !== i6.wrapped || this._$AL.has(s4) || void 0 === this[s4] || this.P(s4, this[s4], i6);
        }
        let t5 = false;
        const s3 = this._$AL;
        try {
          t5 = this.shouldUpdate(s3), t5 ? (this.willUpdate(s3), this._$EO?.forEach((t6) => t6.hostUpdate?.()), this.update(s3)) : this._$EU();
        } catch (s4) {
          throw t5 = false, this._$EU(), s4;
        }
        t5 && this._$AE(s3);
      }
      willUpdate(t5) {
      }
      _$AE(t5) {
        this._$EO?.forEach((t6) => t6.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t5)), this.updated(t5);
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
      shouldUpdate(t5) {
        return true;
      }
      update(t5) {
        this._$Ej && (this._$Ej = this._$Ej.forEach((t6) => this._$EC(t6, this[t6]))), this._$EU();
      }
      updated(t5) {
      }
      firstUpdated(t5) {
      }
    };
    b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[d("elementProperties")] = /* @__PURE__ */ new Map(), b[d("finalized")] = /* @__PURE__ */ new Map(), p?.({ ReactiveElement: b }), (a.reactiveElementVersions ?? (a.reactiveElementVersions = [])).push("2.0.4");
  }
});

// node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/lit-html.js
function P(t5, i6) {
  if (!a2(t5) || !t5.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== s2 ? s2.createHTML(i6) : i6;
}
function S2(t5, i6, s3 = t5, e9) {
  if (i6 === T) return i6;
  let h3 = void 0 !== e9 ? s3._$Co?.[e9] : s3._$Cl;
  const o6 = c3(i6) ? void 0 : i6._$litDirective$;
  return h3?.constructor !== o6 && (h3?._$AO?.(false), void 0 === o6 ? h3 = void 0 : (h3 = new o6(t5), h3._$AT(t5, s3, e9)), void 0 !== e9 ? (s3._$Co ?? (s3._$Co = []))[e9] = h3 : s3._$Cl = h3), void 0 !== h3 && (i6 = S2(t5, h3._$AS(t5, i6.values), h3, e9)), i6;
}
var t2, i3, s2, e3, h2, o3, n3, r3, l2, c3, a2, u2, d2, f2, v, _, m, p2, g, $, y2, x, b2, w, T, E, A, C, V, N, M, R, k, H, I, L, z, Z, j, B;
var init_lit_html = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/lit-html.js"() {
    t2 = globalThis;
    i3 = t2.trustedTypes;
    s2 = i3 ? i3.createPolicy("lit-html", { createHTML: (t5) => t5 }) : void 0;
    e3 = "$lit$";
    h2 = `lit$${Math.random().toFixed(9).slice(2)}$`;
    o3 = "?" + h2;
    n3 = `<${o3}>`;
    r3 = document;
    l2 = () => r3.createComment("");
    c3 = (t5) => null === t5 || "object" != typeof t5 && "function" != typeof t5;
    a2 = Array.isArray;
    u2 = (t5) => a2(t5) || "function" == typeof t5?.[Symbol.iterator];
    d2 = "[ 	\n\f\r]";
    f2 = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g;
    v = /-->/g;
    _ = />/g;
    m = RegExp(`>|${d2}(?:([^\\s"'>=/]+)(${d2}*=${d2}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g");
    p2 = /'/g;
    g = /"/g;
    $ = /^(?:script|style|textarea|title)$/i;
    y2 = (t5) => (i6, ...s3) => ({ _$litType$: t5, strings: i6, values: s3 });
    x = y2(1);
    b2 = y2(2);
    w = y2(3);
    T = Symbol.for("lit-noChange");
    E = Symbol.for("lit-nothing");
    A = /* @__PURE__ */ new WeakMap();
    C = r3.createTreeWalker(r3, 129);
    V = (t5, i6) => {
      const s3 = t5.length - 1, o6 = [];
      let r7, l3 = 2 === i6 ? "<svg>" : 3 === i6 ? "<math>" : "", c4 = f2;
      for (let i7 = 0; i7 < s3; i7++) {
        const s4 = t5[i7];
        let a3, u3, d3 = -1, y3 = 0;
        for (; y3 < s4.length && (c4.lastIndex = y3, u3 = c4.exec(s4), null !== u3); ) y3 = c4.lastIndex, c4 === f2 ? "!--" === u3[1] ? c4 = v : void 0 !== u3[1] ? c4 = _ : void 0 !== u3[2] ? ($.test(u3[2]) && (r7 = RegExp("</" + u3[2], "g")), c4 = m) : void 0 !== u3[3] && (c4 = m) : c4 === m ? ">" === u3[0] ? (c4 = r7 ?? f2, d3 = -1) : void 0 === u3[1] ? d3 = -2 : (d3 = c4.lastIndex - u3[2].length, a3 = u3[1], c4 = void 0 === u3[3] ? m : '"' === u3[3] ? g : p2) : c4 === g || c4 === p2 ? c4 = m : c4 === v || c4 === _ ? c4 = f2 : (c4 = m, r7 = void 0);
        const x2 = c4 === m && t5[i7 + 1].startsWith("/>") ? " " : "";
        l3 += c4 === f2 ? s4 + n3 : d3 >= 0 ? (o6.push(a3), s4.slice(0, d3) + e3 + s4.slice(d3) + h2 + x2) : s4 + h2 + (-2 === d3 ? i7 : x2);
      }
      return [P(t5, l3 + (t5[s3] || "<?>") + (2 === i6 ? "</svg>" : 3 === i6 ? "</math>" : "")), o6];
    };
    N = class _N {
      constructor({ strings: t5, _$litType$: s3 }, n5) {
        let r7;
        this.parts = [];
        let c4 = 0, a3 = 0;
        const u3 = t5.length - 1, d3 = this.parts, [f3, v2] = V(t5, s3);
        if (this.el = _N.createElement(f3, n5), C.currentNode = this.el.content, 2 === s3 || 3 === s3) {
          const t6 = this.el.content.firstChild;
          t6.replaceWith(...t6.childNodes);
        }
        for (; null !== (r7 = C.nextNode()) && d3.length < u3; ) {
          if (1 === r7.nodeType) {
            if (r7.hasAttributes()) for (const t6 of r7.getAttributeNames()) if (t6.endsWith(e3)) {
              const i6 = v2[a3++], s4 = r7.getAttribute(t6).split(h2), e9 = /([.?@])?(.*)/.exec(i6);
              d3.push({ type: 1, index: c4, name: e9[2], strings: s4, ctor: "." === e9[1] ? H : "?" === e9[1] ? I : "@" === e9[1] ? L : k }), r7.removeAttribute(t6);
            } else t6.startsWith(h2) && (d3.push({ type: 6, index: c4 }), r7.removeAttribute(t6));
            if ($.test(r7.tagName)) {
              const t6 = r7.textContent.split(h2), s4 = t6.length - 1;
              if (s4 > 0) {
                r7.textContent = i3 ? i3.emptyScript : "";
                for (let i6 = 0; i6 < s4; i6++) r7.append(t6[i6], l2()), C.nextNode(), d3.push({ type: 2, index: ++c4 });
                r7.append(t6[s4], l2());
              }
            }
          } else if (8 === r7.nodeType) if (r7.data === o3) d3.push({ type: 2, index: c4 });
          else {
            let t6 = -1;
            for (; -1 !== (t6 = r7.data.indexOf(h2, t6 + 1)); ) d3.push({ type: 7, index: c4 }), t6 += h2.length - 1;
          }
          c4++;
        }
      }
      static createElement(t5, i6) {
        const s3 = r3.createElement("template");
        return s3.innerHTML = t5, s3;
      }
    };
    M = class {
      constructor(t5, i6) {
        this._$AV = [], this._$AN = void 0, this._$AD = t5, this._$AM = i6;
      }
      get parentNode() {
        return this._$AM.parentNode;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      u(t5) {
        const { el: { content: i6 }, parts: s3 } = this._$AD, e9 = (t5?.creationScope ?? r3).importNode(i6, true);
        C.currentNode = e9;
        let h3 = C.nextNode(), o6 = 0, n5 = 0, l3 = s3[0];
        for (; void 0 !== l3; ) {
          if (o6 === l3.index) {
            let i7;
            2 === l3.type ? i7 = new R(h3, h3.nextSibling, this, t5) : 1 === l3.type ? i7 = new l3.ctor(h3, l3.name, l3.strings, this, t5) : 6 === l3.type && (i7 = new z(h3, this, t5)), this._$AV.push(i7), l3 = s3[++n5];
          }
          o6 !== l3?.index && (h3 = C.nextNode(), o6++);
        }
        return C.currentNode = r3, e9;
      }
      p(t5) {
        let i6 = 0;
        for (const s3 of this._$AV) void 0 !== s3 && (void 0 !== s3.strings ? (s3._$AI(t5, s3, i6), i6 += s3.strings.length - 2) : s3._$AI(t5[i6])), i6++;
      }
    };
    R = class _R {
      get _$AU() {
        return this._$AM?._$AU ?? this._$Cv;
      }
      constructor(t5, i6, s3, e9) {
        this.type = 2, this._$AH = E, this._$AN = void 0, this._$AA = t5, this._$AB = i6, this._$AM = s3, this.options = e9, this._$Cv = e9?.isConnected ?? true;
      }
      get parentNode() {
        let t5 = this._$AA.parentNode;
        const i6 = this._$AM;
        return void 0 !== i6 && 11 === t5?.nodeType && (t5 = i6.parentNode), t5;
      }
      get startNode() {
        return this._$AA;
      }
      get endNode() {
        return this._$AB;
      }
      _$AI(t5, i6 = this) {
        t5 = S2(this, t5, i6), c3(t5) ? t5 === E || null == t5 || "" === t5 ? (this._$AH !== E && this._$AR(), this._$AH = E) : t5 !== this._$AH && t5 !== T && this._(t5) : void 0 !== t5._$litType$ ? this.$(t5) : void 0 !== t5.nodeType ? this.T(t5) : u2(t5) ? this.k(t5) : this._(t5);
      }
      O(t5) {
        return this._$AA.parentNode.insertBefore(t5, this._$AB);
      }
      T(t5) {
        this._$AH !== t5 && (this._$AR(), this._$AH = this.O(t5));
      }
      _(t5) {
        this._$AH !== E && c3(this._$AH) ? this._$AA.nextSibling.data = t5 : this.T(r3.createTextNode(t5)), this._$AH = t5;
      }
      $(t5) {
        const { values: i6, _$litType$: s3 } = t5, e9 = "number" == typeof s3 ? this._$AC(t5) : (void 0 === s3.el && (s3.el = N.createElement(P(s3.h, s3.h[0]), this.options)), s3);
        if (this._$AH?._$AD === e9) this._$AH.p(i6);
        else {
          const t6 = new M(e9, this), s4 = t6.u(this.options);
          t6.p(i6), this.T(s4), this._$AH = t6;
        }
      }
      _$AC(t5) {
        let i6 = A.get(t5.strings);
        return void 0 === i6 && A.set(t5.strings, i6 = new N(t5)), i6;
      }
      k(t5) {
        a2(this._$AH) || (this._$AH = [], this._$AR());
        const i6 = this._$AH;
        let s3, e9 = 0;
        for (const h3 of t5) e9 === i6.length ? i6.push(s3 = new _R(this.O(l2()), this.O(l2()), this, this.options)) : s3 = i6[e9], s3._$AI(h3), e9++;
        e9 < i6.length && (this._$AR(s3 && s3._$AB.nextSibling, e9), i6.length = e9);
      }
      _$AR(t5 = this._$AA.nextSibling, i6) {
        for (this._$AP?.(false, true, i6); t5 && t5 !== this._$AB; ) {
          const i7 = t5.nextSibling;
          t5.remove(), t5 = i7;
        }
      }
      setConnected(t5) {
        void 0 === this._$AM && (this._$Cv = t5, this._$AP?.(t5));
      }
    };
    k = class {
      get tagName() {
        return this.element.tagName;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      constructor(t5, i6, s3, e9, h3) {
        this.type = 1, this._$AH = E, this._$AN = void 0, this.element = t5, this.name = i6, this._$AM = e9, this.options = h3, s3.length > 2 || "" !== s3[0] || "" !== s3[1] ? (this._$AH = Array(s3.length - 1).fill(new String()), this.strings = s3) : this._$AH = E;
      }
      _$AI(t5, i6 = this, s3, e9) {
        const h3 = this.strings;
        let o6 = false;
        if (void 0 === h3) t5 = S2(this, t5, i6, 0), o6 = !c3(t5) || t5 !== this._$AH && t5 !== T, o6 && (this._$AH = t5);
        else {
          const e10 = t5;
          let n5, r7;
          for (t5 = h3[0], n5 = 0; n5 < h3.length - 1; n5++) r7 = S2(this, e10[s3 + n5], i6, n5), r7 === T && (r7 = this._$AH[n5]), o6 || (o6 = !c3(r7) || r7 !== this._$AH[n5]), r7 === E ? t5 = E : t5 !== E && (t5 += (r7 ?? "") + h3[n5 + 1]), this._$AH[n5] = r7;
        }
        o6 && !e9 && this.j(t5);
      }
      j(t5) {
        t5 === E ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t5 ?? "");
      }
    };
    H = class extends k {
      constructor() {
        super(...arguments), this.type = 3;
      }
      j(t5) {
        this.element[this.name] = t5 === E ? void 0 : t5;
      }
    };
    I = class extends k {
      constructor() {
        super(...arguments), this.type = 4;
      }
      j(t5) {
        this.element.toggleAttribute(this.name, !!t5 && t5 !== E);
      }
    };
    L = class extends k {
      constructor(t5, i6, s3, e9, h3) {
        super(t5, i6, s3, e9, h3), this.type = 5;
      }
      _$AI(t5, i6 = this) {
        if ((t5 = S2(this, t5, i6, 0) ?? E) === T) return;
        const s3 = this._$AH, e9 = t5 === E && s3 !== E || t5.capture !== s3.capture || t5.once !== s3.once || t5.passive !== s3.passive, h3 = t5 !== E && (s3 === E || e9);
        e9 && this.element.removeEventListener(this.name, this, s3), h3 && this.element.addEventListener(this.name, this, t5), this._$AH = t5;
      }
      handleEvent(t5) {
        "function" == typeof this._$AH ? this._$AH.call(this.options?.host ?? this.element, t5) : this._$AH.handleEvent(t5);
      }
    };
    z = class {
      constructor(t5, i6, s3) {
        this.element = t5, this.type = 6, this._$AN = void 0, this._$AM = i6, this.options = s3;
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AI(t5) {
        S2(this, t5);
      }
    };
    Z = { M: e3, P: h2, A: o3, C: 1, L: V, R: M, D: u2, V: S2, I: R, H: k, N: I, U: L, B: H, F: z };
    j = t2.litHtmlPolyfillSupport;
    j?.(N, R), (t2.litHtmlVersions ?? (t2.litHtmlVersions = [])).push("3.2.1");
    B = (t5, i6, s3) => {
      const e9 = s3?.renderBefore ?? i6;
      let h3 = e9._$litPart$;
      if (void 0 === h3) {
        const t6 = s3?.renderBefore ?? null;
        e9._$litPart$ = h3 = new R(i6.insertBefore(l2(), t6), t6, void 0, s3 ?? {});
      }
      return h3._$AI(t5), h3;
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
        const t5 = super.createRenderRoot();
        return (_a = this.renderOptions).renderBefore ?? (_a.renderBefore = t5.firstChild), t5;
      }
      update(t5) {
        const s3 = this.render();
        this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t5), this._$Do = B(s3, this.renderRoot, this.renderOptions);
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
function clamp(value, min, max) {
  const noNegativeZero = (n5) => Object.is(n5, -0) ? 0 : n5;
  if (value < min) {
    return noNegativeZero(min);
  }
  if (value > max) {
    return noNegativeZero(max);
  }
  return noNegativeZero(value);
}
var init_chunk_HF7GESMZ = __esm({
  "node_modules/.pnpm/@shoelace-style+shoelace@2.18.0_@types+react@18.3.12/node_modules/@shoelace-style/shoelace/dist/chunks/chunk.HF7GESMZ.js"() {
  }
});

// node_modules/.pnpm/@shoelace-style+localize@3.2.1/node_modules/@shoelace-style/localize/dist/index.js
function registerTranslation(...translation2) {
  translation2.map((t5) => {
    const code = t5.$code.toLowerCase();
    if (translations.has(code)) {
      translations.set(code, Object.assign(Object.assign({}, translations.get(code)), t5));
    } else {
      translations.set(code, t5);
    }
    if (!fallback) {
      fallback = t5;
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
function n4(t5) {
  return (e9, o6) => "object" == typeof o6 ? r5(t5, e9, o6) : ((t6, e10, o7) => {
    const r7 = e10.hasOwnProperty(o7);
    return e10.constructor.createProperty(o7, r7 ? { ...t6, wrapped: true } : t6), r7 ? Object.getOwnPropertyDescriptor(e10, o7) : void 0;
  })(t5, e9, o6);
}
var o4, r5;
var init_property = __esm({
  "node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/property.js"() {
    init_reactive_element();
    o4 = { attribute: true, type: String, converter: u, reflect: false, hasChanged: f };
    r5 = (t5 = o4, e9, r7) => {
      const { kind: n5, metadata: i6 } = r7;
      let s3 = globalThis.litPropertyMetadata.get(i6);
      if (void 0 === s3 && globalThis.litPropertyMetadata.set(i6, s3 = /* @__PURE__ */ new Map()), s3.set(r7.name, t5), "accessor" === n5) {
        const { name: o6 } = r7;
        return { set(r8) {
          const n6 = e9.get.call(this);
          e9.set.call(this, r8), this.requestUpdate(o6, n6, t5);
        }, init(e10) {
          return void 0 !== e10 && this.P(o6, void 0, t5), e10;
        } };
      }
      if ("setter" === n5) {
        const { name: o6 } = r7;
        return function(r8) {
          const n6 = this[o6];
          e9.call(this, r8), this.requestUpdate(o6, n6, t5);
        };
      }
      throw Error("Unsupported decorator location: " + n5);
    };
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/state.js
function r6(r7) {
  return n4({ ...r7, state: true, attribute: false });
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
    e4 = (e9, t5, c4) => (c4.configurable = true, c4.enumerable = true, Reflect.decorate && "object" != typeof t5 && Object.defineProperty(e9, t5, c4), c4);
  }
});

// node_modules/.pnpm/@lit+reactive-element@2.0.4/node_modules/@lit/reactive-element/decorators/query.js
function e5(e9, r7) {
  return (n5, s3, i6) => {
    const o6 = (t5) => t5.renderRoot?.querySelector(e9) ?? null;
    if (r7) {
      const { get: e10, set: r8 } = "object" == typeof s3 ? n5 : i6 ?? (() => {
        const t5 = Symbol();
        return { get() {
          return this[t5];
        }, set(e11) {
          this[t5] = e11;
        } };
      })();
      return e4(n5, s3, { get() {
        let t5 = e10.call(this);
        return void 0 === t5 && (t5 = o6(this), (null !== t5 || this.hasUpdated) && r8.call(this, t5)), t5;
      } });
    }
    return e4(n5, s3, { get() {
      return o6(this);
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
    o5 = (o6) => o6 ?? E;
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
    e6 = (t5) => (...e9) => ({ _$litDirective$: t5, values: e9 });
    i5 = class {
      constructor(t5) {
      }
      get _$AU() {
        return this._$AM._$AU;
      }
      _$AT(t5, e9, i6) {
        this._$Ct = t5, this._$AM = e9, this._$Ci = i6;
      }
      _$AS(t5, e9) {
        return this.update(t5, e9);
      }
      update(t5, e9) {
        return this.render(...e9);
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
      constructor(t5) {
        if (super(t5), t5.type !== t3.ATTRIBUTE || "class" !== t5.name || t5.strings?.length > 2) throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
      }
      render(t5) {
        return " " + Object.keys(t5).filter((s3) => t5[s3]).join(" ") + " ";
      }
      update(s3, [i6]) {
        if (void 0 === this.st) {
          this.st = /* @__PURE__ */ new Set(), void 0 !== s3.strings && (this.nt = new Set(s3.strings.join(" ").split(/\s/).filter((t5) => "" !== t5)));
          for (const t5 in i6) i6[t5] && !this.nt?.has(t5) && this.st.add(t5);
          return this.render(i6);
        }
        const r7 = s3.element.classList;
        for (const t5 of this.st) t5 in i6 || (r7.remove(t5), this.st.delete(t5));
        for (const t5 in i6) {
          const s4 = !!i6[t5];
          s4 === this.st.has(t5) || this.nt?.has(t5) || (s4 ? (r7.add(t5), this.st.add(t5)) : (r7.remove(t5), this.st.delete(t5)));
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
var t4, e8;
var init_directive_helpers = __esm({
  "node_modules/.pnpm/lit-html@3.2.1/node_modules/lit-html/directive-helpers.js"() {
    init_lit_html();
    ({ I: t4 } = Z);
    e8 = (o6, t5) => void 0 === t5 ? void 0 !== o6?._$litType$ : o6?._$litType$ === t5;
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
        } catch (e9) {
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
        } catch (e9) {
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
            Gallery.addImage(m2.data);
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
          window.addEventListener("beforeunload", (e9) => {
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
                  const n5 = app.graph.getNodeById(detail.node.split(":")[0]);
                  if (n5?.getInnerNodes) return;
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
*/
