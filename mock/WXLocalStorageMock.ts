export default class WXLocalStorageMock {
  store: any;
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getStorage({ key, success, fail }: any) {
    const data = this.store[key];
    setTimeout(() => success({ data }));
  }

  getStorageSync(key: string) {
    return this.store[key] || undefined;
  }

  setStorage({ key, data, success, fail }: any) {
    this.store[key] = data;
    setTimeout(() => success());
  }

  setStorageSync(key: string, value: any) {
    this.store[key] = value;
  }

  removeStorage({ key, success, fail }: any) {
    delete this.store[key];
    setTimeout(() => success());
  }

  removeStorageSync(key: string) {
    delete this.store[key];
  }

  getStorageInfoSync() {
    return {
      keys: Object.keys(this.store),
    };
  }
}
