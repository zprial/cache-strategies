import { Adapter } from "../types";
import { validateKey } from "../validator";

const wxAdapter: Adapter = {
  type: "wxAdapter",
  async getItem(key: string) {
    if (!validateKey(key, "getItem")) {
      return undefined;
    }
    try {
      // @ts-ignore
      const result = wx.getStorageSync(key);
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
    return wx.setStorageSync(key, val);
  },
  async removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    // @ts-ignore
    return wx.removeStorageSync(key);
  },
  async getAllKeys() {
    // @ts-ignore
    return wx.getStorageInfoSync()?.keys;
  },
};

// 采用异步存储
const wxAsyncAdapter: Adapter = {
  type: "wxAsyncAdapter",
  async getItem(key: string) {
    if (!validateKey(key, "getItem")) {
      return undefined;
    }
    return new Promise((resolve) => {
      // @ts-ignore
      wx.getStorage({
        key,
        success: (res: any) => {
          resolve(res.data);
        },
        fail: () => {
          resolve(undefined);
        },
      });
    });
  },
  async setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    return new Promise((resolve, reject) => {
      // @ts-ignore
      wx.setStorage({
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
      wx.removeStorage({
        key,
        success: () => resolve(undefined),
        fail: reject,
      });
    });
  },
  async getAllKeys() {
    // @ts-ignore
    return wx.getStorageInfoSync()?.keys;
  },
};

export { wxAsyncAdapter, wxAdapter };

export default wxAdapter;
