export default class DDLocalStorageMock {
  store: any;
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getStorageSync(param: { key: string }) {
    return this.store[param.key] || null;
  }

  setStorageSync(param: { key: string; data: any }) {
    this.store[param.key] = param.data;
  }

  removeStorageSync(param: { key: string }) {
    delete this.store[param.key];
  }
  getStorageInfoSync() {
    return Object.keys(this.store);
  }
}