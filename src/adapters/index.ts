import { Adapter } from '../types'
import webStoreage from "./web";

export default function getDefaultAdapter(): Adapter | null {
  if (global && global.localStorage) {
    return webStoreage;
  }

  return null;
}
