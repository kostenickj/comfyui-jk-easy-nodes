// src_web/common/storage.ts
var NAMESPACE = "jk-comfyui-helpers_";
var StorageHelper = class {
  constructor(storageImpl) {
    this.storageImpl = storageImpl;
  }
  get(key, defaultVal) {
    const value = this.storageImpl.getItem(NAMESPACE + key);
    return value ?? defaultVal;
  }
  set(key, value) {
    localStorage.setItem(NAMESPACE + key, value);
  }
  getJSON(key, defaultVal) {
    try {
      const value = this.storageImpl.getItem(NAMESPACE + key);
      return value ? JSON.parse(value) : defaultVal;
    } catch (error) {
      console.error(`Error retrieving ${key} from storage`, error);
    }
  }
  setJSONVal(key, value) {
    try {
      this.storageImpl.setItem(NAMESPACE + key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to localStorage`, error);
    }
  }
};
var SessionStorageHelper = new StorageHelper(sessionStorage);
var LocalStorageHelper = new StorageHelper(localStorage);
export {
  LocalStorageHelper,
  SessionStorageHelper
};
