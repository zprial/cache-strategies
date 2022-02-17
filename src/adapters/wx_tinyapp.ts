import { Adapter } from "../types";
import { validateKey } from "../validator";

const wxAdapter: Adapter = {
  type: 'wxAdapter',
  async getItem(key: string) {
    if (!validateKey(key, "getItem")) {
      return null;
    }
    try {
      // @ts-ignore
      const result = wx.getStorageSync(key);
      if (result) {
        return result;
      }
      return null;
    } catch (error) {
      return null;
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
    return wx.getStorageInfoSync()?.keys
  }
};

export default wxAdapter;
