import { Adapter } from "../types";
import { validateKey } from "../validator";

const ddAdapter: Adapter = {
  type: 'ddAdapter',
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
  async getAllKeys() {
    // @ts-ignore
    return dd.getStorageInfoSync()?.keys
  }
};

export default ddAdapter;
