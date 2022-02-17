import { Adapter } from "../types";
import { validateKey } from "../validator";

const webAdapter: Adapter = {
  type: 'webAdapter',
  getItem(key: string) {
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
  setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    return localStorage.setItem(key, JSON.stringify(val));
  },
  removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    return localStorage.removeItem(key);
  },
  getAllKeys() {
    return Object.keys(localStorage);
  }
};

export default webAdapter;
