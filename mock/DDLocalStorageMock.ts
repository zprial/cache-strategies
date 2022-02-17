export default class DDLocalStorageMock {
  store: any;
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getStorageSync(param: { key: string }) {
    return this.store[param.key] || undefined;
  }

  setStorageSync(param: { key: string; data: any }) {
    this.store[param.key] = param.data;
  }

  removeStorageSync(param: { key: string }) {
    delete this.store[param.key];
  }
  getStorageInfoSync() {
    return {
      keys: Object.keys(this.store)
    };
  }
}