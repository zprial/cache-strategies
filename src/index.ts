import CacheStrategy from "./core/CacheStrategy";
import { MemoryAdapter, MapAdapter } from "./adapters/memory";
import webAdapter, { webSessionAdapter } from "./adapters/web";
import wxAdapter, { wxAsyncAdapter } from "./adapters/wx_tinyapp";
import ddAdapter, { ddAsyncAdapter } from "./adapters/dd_tinyapp";

export {
  CacheStrategy,
  // 各平台适配器
  MemoryAdapter,
  MapAdapter,
  webAdapter,
  webSessionAdapter,
  wxAdapter,
  ddAdapter,
  wxAsyncAdapter,
  ddAsyncAdapter,
};

export default new CacheStrategy();
