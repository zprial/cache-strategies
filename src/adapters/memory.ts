import { LRUMap } from "lru_map";
import { Adapter } from "../types";
import { validateKey } from "../validator";

export class MemoryAdapter extends LRUMap<string, any> {
  type = "memoryAdapter";
  constructor(limit: number, entries?: Iterable<[string, any]>) {
    super(limit, entries);
  }
  async getItem(key: string): Promise<any> {
    if (!validateKey(key, "getItem")) {
      return null;
    }
    const result = this.get(key);
    if (result) {
      return result;
    }
    return null;
  }
  async setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    return this.set(key, val);
  }
  async removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    return this.delete(key);
  }
}

export class MapAdapter extends Map<string, any> {
  type = "mapAdapter";
  constructor(entries?: Iterable<[string, any]>) {
    super(entries);
  }
  async getItem(key: string): Promise<any> {
    if (!validateKey(key, "getItem")) {
      return null;
    }
    const result = this.get(key);
    if (result) {
      return result;
    }
    return null;
  }
  async setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    return this.set(key, val);
  }
  async removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    return this.delete(key);
  }
}