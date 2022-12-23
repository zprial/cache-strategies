import { Adapter } from "../types";
import { validateKey } from "../validator";

const ddAdapter: Adapter = {
  type: "ddAdapter",
  async getItem(key: string) {
    if (!validateKey(key, "getItem")) {
      return undefined;
    }
    try {
      // @ts-ignore
      const result = dd.getStorageSync({ key })?.data;
      return result;
    } catch (error) {
      return undefined;
    }
  },
  async setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    // @ts-ignore
    return dd.setStorageSync({
      key,
      data: val,
    });
  },
  async removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    // @ts-ignore
    return dd.removeStorageSync({ key });
  },
  async getAllKeys() {
    // @ts-ignore
    return dd.getStorageInfoSync()?.keys;
  },
};

// 采用异步存储
const ddAsyncAdapter: Adapter = {
  type: "ddAsyncAdapter",
  async getItem(key: string) {
    if (!validateKey(key, "getItem")) {
      return undefined;
    }
    return new Promise((resolve) => {
      // @ts-ignore
      dd.getStorage({
        key,
        success: (res: any) => {
          resolve(res.data);
        },
        fail: () => resolve(undefined),
      });
    });
  },
  async setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    return new Promise((resolve, reject) => {
      // @ts-ignore
      dd.setStorage({
        key,
        data: val,
        success: () => resolve(undefined),
        fail: reject,
      });
    });
  },
  async removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    return new Promise((resolve, reject) => {
      // @ts-ignore
      dd.removeStorage({
        key,
        success: () => resolve(undefined),
        fail: reject,
      });
    });
  },
  async getAllKeys() {
    // @ts-ignore
    return dd.getStorageInfoSync()?.keys;
  },
};

export { ddAdapter, ddAsyncAdapter };

export default ddAdapter;
