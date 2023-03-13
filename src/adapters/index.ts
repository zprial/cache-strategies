import { Adapter } from "../types";
import webAdapter, { webSessionAdapter } from "./web";
import wxAdapter, { wxAsyncAdapter } from "./wx_tinyapp";
import ddAdapter, { ddAsyncAdapter } from "./dd_tinyapp";
import { MemoryAdapter, MapAdapter } from "./memory";

export default function getDefaultAdapter(): Adapter | null {
  if (typeof window === "object" && window.localStorage) {
    return webAdapter;
  }
  // @ts-ignore
  else if (typeof wx === "object" && wx.getStorageSync) {
    return wxAdapter;
  }
  // @ts-ignore
  else if (typeof dd === "object" && dd.getStorageSync) {
    return ddAdapter;
  } else {
    // return new MemoryAdapter(Number.MAX_SAFE_INTEGER);
    return new MapAdapter();
  }
}

export {
  webAdapter,
  webSessionAdapter,
  wxAdapter,
  ddAdapter,
  MemoryAdapter,
  MapAdapter,
  wxAsyncAdapter,
  ddAsyncAdapter,
};
