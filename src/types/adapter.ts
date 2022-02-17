export declare interface Adapter {
  type?: string;
  getItem(key: string): Promise<any> | any;
  setItem(key: string, val: any): Promise<any> | any;
  removeItem(key: string): Promise<void> | any;
  getAllKeys?(): string[] | Promise<string[]>;
}
