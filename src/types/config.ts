import { StorageConstructor } from "../core/Storage";

export declare interface CacheStrategyConstructor extends StorageConstructor {
  // 判断是否需要来缓存数据，
  // true - 需要缓存，false - 不需要缓存
  validateCache?(val: any): boolean | Promise<boolean>;
}

export declare interface CacheStrategyConfig {
  // 判断是否需要来缓存数据，
  // true - 需要缓存，false - 不需要缓存
  validateCache?(val: any): boolean | Promise<boolean>;
  // 此次用来缓存的key，默认会用md5("JSON.stringify(args)_fn.toString()")
  cacheKey?: string;

  // 特殊的一些配置，一般只针对某些策略生效
  // 只针对 cacheThenUpdate 策略生效，当接口调用成功返回数据后，
  // 如果数据符合 `validateCache` 检验的话会回调
  updateCallback?(newVal: any): any;

  // 有效期相关
  // 最大存储时间, 默认7天，单位毫秒,优先级高于 expires
  maxAge?: number;
  // 过期时间戳
  expires?: number | Date;
}
