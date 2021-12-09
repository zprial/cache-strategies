import { Adapter } from '../types'
import webAdapter from "./web";
import wxAdapter from './wx_tinyapp'
import { MapAdapter } from './memory'

export default function getDefaultAdapter(): Adapter | null {
  if (typeof window === 'object' && window.localStorage) {
    return webAdapter;
  }
  // @ts-ignore
  else if (typeof wx === 'object' && wx.getStorageSync) {
    return wxAdapter;
  } else {
    return new MapAdapter();
  }
}
