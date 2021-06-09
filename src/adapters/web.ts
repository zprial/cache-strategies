import { Adapter } from '../types'
import { validateKey } from "../validator";

const webStoreage: Adapter = {
  async getItem(key: string) {
    if (!validateKey(key, "getItem")) {
      return null;
    }
    const result = localStorage.getItem(key);
    if (result) {
      try {
        return JSON.parse(result);
      } catch (error) {
        return null;
      }
    }
    return null;
  },
  async setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    localStorage.setItem(key, JSON.stringify(val));
  },
  async removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
  },
};

export default webStoreage;
