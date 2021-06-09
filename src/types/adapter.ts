export declare interface Adapter {
  getItem(key: string): Promise<any>;
  setItem(key: string, val: any): Promise<void>;
  removeItem(key: string): Promise<void>;
}
