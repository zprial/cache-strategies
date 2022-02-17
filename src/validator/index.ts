/**
 * 校验参数 key
 * 必须是字符串，并且不为空字符串
 * @param key 获取参数key
 * @returns {Boolean}
 */
export const validateKey = (
  key: string,
  type: "getItem" | "setItem" | "removeItem"
) => {
  if (key && typeof key === "string") {
    return true;
  }
  console.error(`${type} 必须接收字符串作为参数，但是传入参数:`, key);
  return false;
};

/**
 * 检测是否需要缓存值
 * @param value 将要缓存的值
 * @returns {Boolean}
 */
export const validateCacheFunc = (value: any) => {
  if (
    value === undefined ||
    value === null ||
    value === '' ||
    Number.isNaN(value) ||
    typeof value === "function" ||
    typeof value === 'bigint'
  ) {
    return false;
  }
  return true;
};
