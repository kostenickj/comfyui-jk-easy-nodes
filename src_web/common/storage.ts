const NAMESPACE = 'jk-comfyui-helpers_';

class StorageHelper {
    constructor(private storageImpl: Storage) {}

    get(key: string, defaultVal?: string) {
        const value = this.storageImpl.getItem(NAMESPACE + key);
        return value ?? defaultVal;
    }
    set(key: string, value: string) {
        localStorage.setItem(NAMESPACE + key, value);
    }
    getJSON(key: string, defaultVal?: any) {
        try {
            const value = this.storageImpl.getItem(NAMESPACE + key);
            return value ? JSON.parse(value) : defaultVal;
        } catch (error) {
            console.error(`Error retrieving ${key} from storage`, error);
        }
    }
    setJSONVal(key: string, value: any) {
        try {
            this.storageImpl.setItem(NAMESPACE + key, JSON.stringify(value));
        } catch (error) {
            console.error(`Error saving ${key} to localStorage`, error);
        }
    }
}

export const SessionStorageHelper = new StorageHelper(sessionStorage);
export const LocalStorageHelper = new StorageHelper(localStorage);
