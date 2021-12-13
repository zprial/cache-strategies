import { Adapter } from "../types";
import { validateKey } from "../validator";

const ddAdapter: Adapter = {
  type: 'ddAdapter',
  async getItem(key: string) {
    if (!validateKey(key, "getItem")) {
      return null;
    }
    try {
      // @ts-ignore
      const result = wx.getStorageSync({ key });
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
    return dd.setStorageSync({
      key,
      data: val
    });
  },
  async removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    // @ts-ignore
    return dd.removeStorageSync({ key });
  },
};

export default ddAdapter;
