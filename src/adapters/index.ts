import { Adapter } from '../types'
import webAdapter from "./web";
import wxAdapter from './wx_tinyapp'

export default function getDefaultAdapter(): Adapter | null {
  if (window && window.localStorage) {
    return webAdapter;
  }
  // @ts-ignore
  else if (wx && wx.getStorageSync) {
    return wxAdapter;
  }

  return null;
}
