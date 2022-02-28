import { Adapter, StorageItem } from "../types";
import { merge } from "../utils";
import getDefaultAdapter from "../adapters";
import { CACHE_PREFIX } from "../constants";

export interface StorageConstructor {
  // 存储器前缀
  prefix: string;
  // 启动时不检查检查数据是否过期，默认false
  disableCheckExpiredWhenLaunch?: boolean;
  // 平台适配器
  adapter?: Adapter;
  // 最大存储时间, 默认7天，单位毫秒
  maxAge?: number;
}

const defaultConfig = {
  prefix: "",
  disableCheckExpiredWhenLaunch: false,
  adapter: getDefaultAdapter(),
  maxAge: 604800000, // 7天
};

export default class Storage {
  // 存储器前缀
  prefix: string;
  // 启动时不检查检查数据是否过期，默认false
  disableCheckExpiredWhenLaunch: boolean;
  // 平台适配器
  adapter: Adapter;
  // 最大存储时间, 默认7天，单位毫秒，默认7天后
  maxAge: number;
  // 过期时间，默认7天后
  expires: number;
  constructor(config?: StorageConstructor) {
    const _config = merge(defaultConfig, config);
    this.adapter = _config.adapter;
    this.prefix = _config.prefix;
    this.maxAge = _config.maxAge;
    this.expires = Date.now() + _config.maxAge;
    this.disableCheckExpiredWhenLaunch = _config.disableCheckExpiredWhenLaunch;

    if (!this.disableCheckExpiredWhenLaunch) {
      this.checkAllExpired();
    }
  }

  // 生成存储的key
  private getSaveKey(key: string) {
    return `${CACHE_PREFIX}${this.prefix}${key}`;
  }

  async getItem(key: string) {
    const value: StorageItem = await this.adapter.getItem(this.getSaveKey(key));
    const isExpired = this.checkExpired(value);
    if (isExpired) {
      await this.removeItem(key);
      return null;
    }
    if (value?.__hd_strategy) {
      return value?.value;
    }
    return value;
  }

  setItem(
    key: string,
    value: any,
    config?: {
      // 缓存时间，单位毫秒，优先级高于 expires
      maxAge?: number;
      // 过期时间戳
      expires?: number | Date;
    }
  ) {
    const { maxAge, expires } = config || {};
    const expired = maxAge ? Date.now() + maxAge : +expires;
    const storageItem: StorageItem = {
      key,
      value,
      expires: expired || this.expires,
      __hd_strategy: true,
    };
    return this.adapter.setItem(this.getSaveKey(key), storageItem);
  }

  removeItem(key: string) {
    return this.adapter.removeItem(this.getSaveKey(key));
  }

  // 获取改存储空间下的所有key
  private async getAllKeys() {
    const keys = await this.adapter.getAllKeys?.();
    const nameSpace = CACHE_PREFIX + this.prefix;
    if (!keys?.length) {
      console.warn(
        `[CACHE-STRATEGY]通知：空间${nameSpace}没有缓存数据或者 adapter 不支持 getAllKeys 方法`
      );
      return [];
    }
    const filteredKeys = keys.filter((key) => key.includes(nameSpace));
    return filteredKeys;
  }

  // 清空存储空间下的数据
  async clear() {
    const allKeys = await this.getAllKeys();
    for (let k of allKeys) {
      await this.adapter.removeItem(k);
    }
  }

  // 校验过期时间
  checkExpired(item: StorageItem) {
    const { expires } = item || {};
    if (expires && +new Date(expires) < Date.now()) {
      return true;
    }
    return false;
  }

  // 校验全部过期时间, 过期后清除
  async checkAllExpired() {
    const allKeys = await this.getAllKeys();
    for (let k of allKeys) {
      const value = await this.adapter.getItem(k);
      if (this.checkExpired(value)) {
        await this.adapter.removeItem(k);
      }
    }
  }
}
