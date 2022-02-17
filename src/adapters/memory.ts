import { LRUMap } from "lru_map";
import { Adapter } from "../types";
import { validateKey } from "../validator";

export class MemoryAdapter {
  type = "memoryAdapter";
  store: LRUMap<string, any>;
  constructor(limit?: number, entries?: Iterable<[string, any]>) {
    this.store = new LRUMap(limit, entries);
  }
  async getItem(key: string): Promise<any> {
    if (!validateKey(key, "getItem")) {
      return null;
    }
    const result = this.store.get(key);
    if (result) {
      return result;
    }
    return null;
  }
  async setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    return this.store.set(key, val);
  }
  async removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    return this.store.delete(key);
  }
}

export class MapAdapter {
  type = "mapAdapter";
  store: Map<string, any>;
  constructor(entries?: Iterable<[string, any]>) {
    this.store = new Map(entries)
  }
  async getItem(key: string): Promise<any> {
    if (!validateKey(key, "getItem")) {
      return null;
    }
    const result = this.store.get(key);
    if (result) {
      return result;
    }
    return null;
  }
  async setItem(key: string, val: any) {
    if (!validateKey(key, "setItem")) {
      return;
    }
    return this.store.set(key, val);
  }
  async removeItem(key: string) {
    if (!validateKey(key, "removeItem")) {
      return;
    }
    return this.store.delete(key);
  }
}