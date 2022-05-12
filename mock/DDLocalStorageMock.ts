export default class DDLocalStorageMock {
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

  getStorageSync(param: { key: string }) {
    return { data: this.store[param.key] || undefined };
  }

  setStorage({ key, data, success, fail }: any) {
    this.store[key] = data;
    setTimeout(() => success());
  }

  setStorageSync(param: { key: string; data: any }) {
    this.store[param.key] = param.data;
  }

  removeStorage({ key, success, fail }: any) {
    delete this.store[key];
    setTimeout(() => success());
  }

  removeStorageSync(param: { key: string }) {
    delete this.store[param.key];
  }
  getStorageInfoSync() {
    return {
      keys: Object.keys(this.store),
    };
  }
}
