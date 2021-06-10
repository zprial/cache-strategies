import { Adapter } from './adapter'

export declare interface CacheStrategyConfig {
  // 各个平台用来缓存数据的 存储器
  adapter: Adapter | null;
  // 判断是否需要来缓存数据，
  // true - 需要缓存，false - 不需要缓存
  validateCache?(val: any): boolean | Promise<boolean>;
  // 缓存的key的前缀
  prefix?: string;
  // 此次用来缓存的key，默认会用md5("JSON.stringify(args)_fn.toString()")
  currentSaveKey?: string;

  // 特殊的一些配置，一般只针对某些策略生效
  // 只针对 cacheThenUpdate 策略生效，当接口调用成功返回数据后，
  // 如果数据符合 `validateCache` 检验的话会回调
  updateCallback?(newVal: any): any
}
