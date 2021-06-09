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
}
