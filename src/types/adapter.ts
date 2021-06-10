export declare interface Adapter {
  type?: string;
  getItem(key: string): Promise<any>;
  setItem(key: string, val: any): Promise<void>;
  removeItem(key: string): Promise<void>;
}
