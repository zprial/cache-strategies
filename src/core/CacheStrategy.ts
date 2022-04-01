import md5 from "md5";
import Storage from "./Storage";
import { CacheStrategyConfig, CacheStrategyConstructor } from "../types";
import { validateCacheFunc } from "../validator";
import { merge } from "../utils";

type PromiseResolvedType<T> = T extends Promise<infer R> ? R : T;
type AsyncReturnType<F extends (...args: object[]) => unknown> =
  PromiseResolvedType<ReturnType<F>>;

class CacheStrategy {
  store: Storage;
  private config: CacheStrategyConfig;
  constructor(config?: CacheStrategyConstructor) {
    this.store = new Storage({
      adapter: config?.adapter,
      prefix: config?.prefix,
      maxAge: config?.maxAge,
      disableCheckExpiredWhenLaunch: config?.disableCheckExpiredWhenLaunch,
    });

    this.config = {
      validateCache: config?.validateCache || validateCacheFunc,
    };
  }

  /**
   * 合并config并返回存储的 key 值
   * @param {CacheStrategyConfig} customConfig 用户自定义的config
   * @param fn 用户传入的方法
   * @param args 用户传入的参数
   * @returns
   */
  private mergeConfigAndSavekey(
    customConfig: Partial<CacheStrategyConfig>,
    fn: Function,
    args: any[]
  ) {
    const _config: Partial<CacheStrategyConfig> = merge(
      this.config,
      customConfig
    );
    const saveKey = _config?.currentSaveKey
      ? _config?.currentSaveKey +
        `/${md5(JSON.stringify(args)).substring(0, 16)}`
      : `/${md5(`${JSON.stringify(args)}_${fn.toString()}`)}`;

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
  private async validateAndCache(
    config: CacheStrategyConfig,
    saveKey: string,
    val: any
  ) {
    if (await config.validateCache(val)) {
      this.store.setItem(saveKey, val, {
        expires: config.expires,
        maxAge: config.maxAge,
      });
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
  staleWhileRevalidate<T extends (...args: any) => any>(
    fn: T,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<AsyncReturnType<T>> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);
      // 优先从缓存中读取
      const result = await this.store.getItem(saveKey);
      if (await _config.validateCache(result)) {
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
  cacheOnly<T extends (...args: any) => any>(
    fn: T,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<AsyncReturnType<T>> {
    return async (...args: any[]) => {
      const { saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      const result = await this.store.getItem(saveKey);
      return result;
    };
  }

  // 只从接口方法中获取
  apiOnly<T extends (...args: any) => any>(
    fn: T
  ): (...args: any[]) => Promise<AsyncReturnType<T>> {
    return async (...args: any[]) => {
      const data = await fn(...args);
      return data;
    };
  }

  // 缓存优先
  // 有缓存走缓存，没有缓存走接口
  cacheFirst<T extends (...args: any) => any>(
    fn: T,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<AsyncReturnType<T>> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      // 优先从缓存中读取
      const result = await this.store.getItem(saveKey);
      if (await _config.validateCache(result)) {
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
  apiFirst<T extends (...args: any) => any>(
    fn: T,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<AsyncReturnType<T>> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      try {
        const data = await fn(...args);
        if (await this.validateAndCache(_config, saveKey, data)) {
          return data;
        }
      } catch (error) {}

      // 优先从缓存中读取
      const result = await this.store.getItem(saveKey);
      return result;
    };
  }

  // 缓存和接口竞速优先，谁先拿到结果用谁的，同时会更新缓存，慎用
  // 依赖 `Promise.any`，请自行打好补丁
  cacheAndApiRace<T extends (...args: any) => any>(
    fn: T,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<AsyncReturnType<T>> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      const result = await Promise.any([
        Promise.resolve(fn(...args)).then((data) => {
          this.validateAndCache(_config, saveKey, data);
          return data;
        }),
        this.store.getItem(saveKey),
      ]);
      this.validateAndCache(_config, saveKey, result);
      return result;
    };
  }

  /**
   * 优先返回缓存，等接口返回后再次回调callback，并存储数据到缓存
   * 如果没有缓存，则等待接口返回数据，不会触发callback
   */
  cacheThenUpdate<T extends (...args: any) => any>(
    fn: T,
    config?: Partial<CacheStrategyConfig>
  ): (...args: any[]) => Promise<AsyncReturnType<T>> {
    return async (...args: any[]) => {
      const { _config, saveKey } = this.mergeConfigAndSavekey(config, fn, args);

      const result = await this.store.getItem(saveKey);
      if (await _config.validateCache(result)) {
        Promise.resolve(fn(...args)).then(async (res) => {
          this.validateAndCache(_config, saveKey, res);
          if (
            typeof _config.updateCallback === "function" &&
            _config.validateCache(res)
          ) {
            _config.updateCallback(res);
          }
        });
        return result;
      } else {
        const data = await fn(...args);
        this.validateAndCache(_config, saveKey, data);
        return data;
      }
    };
  }

  /**
   * 获取本次cache策略实例用的 storage
   */
  getStorage() {
    return this.store;
  }
}

export default CacheStrategy;
