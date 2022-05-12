// 存储的数据格式
export interface StorageItem {
  key: string;
  value: any;
  // 过期时间，时间戳: + new Date();
  expires: number;
  __hd_strategy: true;
}
