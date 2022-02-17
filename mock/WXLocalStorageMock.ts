export default class WXLocalStorageMock {
  store: any;
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getStorageSync(key: string) {
    return this.store[key] || null;
  }

  setStorageSync(key: string, value: any) {
    this.store[key] = value;
  }

  removeStorageSync(key: string) {
    delete this.store[key];
  }
  getStorageInfoSync() {
    return Object.keys(this.store);
  }
}