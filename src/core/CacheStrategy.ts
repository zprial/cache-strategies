import * as md5 from "md5";
import { CacheStrategyConfig } from "../types";
import getDefaultAdapter from "../adapters";
import { validateCacheFunc } from "../validator";
import { mergeConfig } from "../utils";

class CacheStrategy {
  protected config: CacheStrategyConfig;
  constructor(config?: Partial<Omit<CacheStrategyConfig, "currentSaveKey">>) {
    const { adapter, ...others } = config || {};
    this.config = {
      prefix: "CACHE-STRATEGY/",
      validateCache: validateCacheFunc,
      ...others,
      adapter: adapter || getDefaultAdapter(),
    };
  }

  // 更改配置
  useConfig(config: Partial<CacheStrategyConfig>) {
    this.config = {
      ...this.config,
      ...config,
    };
  }

  /**
   * 合并config并返回存储的 key 值
   * @param {CacheStrategyConfig} customConfig 用户自定义的config
   * @param fn 用户传入的方法
   * @param args 用户传入的参数
   * @returns
   */
  mergeConfigAndSavekey(
    customConfig: Partial<CacheStrategyConfig>,
    fn: Function,
    args: any[]
  ) {
    const _config = mergeConfig(this.config, customConfig);
    const saveKey =
      _config?.currentSaveKey ||
      _config.prefix + md5(`${JSON.stringify(args)}_${fn.toString()}`);

    return {
      _config,
      saveKey,
    };
  }

  /**
   * 检验数据，通过则缓存
   * @param {CacheStrategyConfig} config 缓存配置
   * @param {String} saveKey 保存的key
   * @param val 存储的数据
   */
  async validateAndCache(
    config: CacheStrategyConfig,
    saveKey: string,
    val: any
  ) {
    if (await config.validateCache(val)) {
      config.adapter.setItem(saveKey, val);
      return true;
    }
    return false;
  }

  /**
   * 1. 当本地有缓存的时候会返回缓存结果，并执行方法获取新的结果进行缓存
   * 2. 当本地没有缓存的话，直接走方法获取结果返回，并缓存结果
   * https://developers.google.com/web/tools/workbox/modules/workbox-strategies#stale-while-revalidate
   *
   * @param {Function} fn 执行的方法，其结果将会在满足条件的情况下被缓存
   * @param {CacheStrategyConfig} config 修改一些配置
   * @returns {Function}
   */
  staleWhileRevalidate(
    fn: Function,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<any> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);
      // 优先从缓存中读取
      const result = await _config.adapter.getItem(saveKey);
      if (result) {
        Promise.resolve(fn(...args)).then(async (res) => {
          this.validateAndCache(_config, saveKey, res);
        });
        return result;
      }
      const data = await fn(...args);
      this.validateAndCache(_config, saveKey, data);
      return data;
    };
  }

  // 只从缓存中读取
  cacheOnly(
    fn: Function,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<any> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      const result = await _config.adapter.getItem(saveKey);
      return result;
    };
  }

  // 只从接口方法中获取
  apiOnly(
    fn: Function,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<any> {
    return async (...args: any[]) => {
      const data = await fn(...args);
      return data;
    };
  }

  // 缓存优先
  // 有缓存走缓存，没有缓存走接口
  cacheFirst(
    fn: Function,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<any> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      // 优先从缓存中读取
      const result = await _config.adapter.getItem(saveKey);
      if (result) {
        return result;
      }
      const data = await fn(...args);
      this.validateAndCache(_config, saveKey, data);
      return data;
    };
  }

  // 接口优先
  // 优先从接口获取，
  // 成功则返回数据并缓存
  // 获取失败或者数据不符合 `config.validateCache()`，那么降级从缓存获取
  // 注意：此方法会捕获接口异常，不会往外抛
  apiFirst(
    fn: Function,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<any> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      try {
        const data = await fn(...args);
        if (await this.validateAndCache(_config, saveKey, data)) {
          return data;
        }
      } catch (error) {}

      // 优先从缓存中读取
      const result = await _config.adapter.getItem(saveKey);
      return result;
    };
  }

  // 缓存和接口竞速优先，谁先拿到结果用谁的
  // 依赖 `Promise.any`，请自行打好补丁
  cacheAndApiRace(
    fn: Function,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<any> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      const result = await Promise.any([
        fn(...args),
        _config.adapter.getItem(saveKey),
      ]);
      this.validateAndCache(_config, saveKey, result);
      return result;
    };
  }

  /**
   * 优先返回缓存，等接口返回后再次回调callback，并存储数据到缓存
   * 如果没有缓存，则等待接口返回数据，不会触发callback
   */
  cacheThenUpdate(
    fn: Function,
    config?: Partial<CacheStrategyConfig>,
    callback?: (newValue: any) => any
  ): (...args: any[]) => Promise<any> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      const result = await _config.adapter.getItem(saveKey);
      if (result) {
        Promise.resolve(fn(...args)).then(async (res) => {
          this.validateAndCache(_config, saveKey, res);
          if (typeof callback === "function") callback(res);
        });
        return result;
      } else {
        const data = await fn(...args);
        this.validateAndCache(_config, saveKey, data);
        return data;
      }
    };
  }
}

export default CacheStrategy;
