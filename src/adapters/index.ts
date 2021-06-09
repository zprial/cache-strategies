import { Adapter } from '../types'
import webStoreage from "./web";

export default function getDefaultAdapter(): Adapter | null {
  if (window && window.localStorage) {
    return webStoreage;
  }

  return null;
}
