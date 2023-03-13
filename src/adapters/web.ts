import { Adapter } from "../types";
import { validateKey } from "../validator";

const webAdapter: Adapter = {
  type: 'webAdapter',
  getItem(key: string) {
    if (!validateKey(key, "getItem")) {
      return undefined;
    }
    const result = localStorage.getItem(key);
    try {
      return JSON.parse(result);
    } catch (error) {
      return undefined;
    }
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

const webSessionAdapter: Adapter = {
  type: 'webAdapter',
  getItem(key: string) {
    if (!validateKey(key, "getItem")) {
      return undefined;
    }
    const result = sessionStorage.getItem(key);
    try {
      return JSON.parse(result);
    } catch (error) {
      return undefined;
    }
  },
  setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    return sessionStorage.setItem(key, JSON.stringify(val));
  },
  removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    return sessionStorage.removeItem(key);
  },
  getAllKeys() {
    return Object.keys(sessionStorage);
  }
};

export default webAdapter;

export { webSessionAdapter }