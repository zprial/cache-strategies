import { validateKey, validateCacheFunc } from "../src/validator";

describe("测试默认校验器:", () => {

  beforeAll(() => {
    console.error = () => {}
  });

  test("存储key 校验器，传入的key必须是 string 类型的", () => {
    // @ts-ignore
    expect(validateKey(1, "getItem")).toBe(false);
    expect(validateKey(null, "getItem")).toBe(false);
    // @ts-ignore
    expect(validateKey(NaN, "getItem")).toBe(false);
    // @ts-ignore
    expect(validateKey(undefined, "getItem")).toBe(false);
    // @ts-ignore
    expect(validateKey([], "getItem")).toBe(false);
    // @ts-ignore
    expect(validateKey(() => {}, "getItem")).toBe(false);
    expect(validateKey("abc", "getItem")).toBe(true);
  });

  test("当前接口返回的值是否需要缓存：", () => {
    expect(validateCacheFunc(undefined)).toBe(false);
    expect(validateCacheFunc(null)).toBe(false);
    expect(validateCacheFunc(NaN)).toBe(false);
    expect(validateCacheFunc(() => {})).toBe(false);
    expect(validateCacheFunc(0)).toBe(true);
    expect(validateCacheFunc('abc')).toBe(true);
    expect(validateCacheFunc('')).toBe(false);
    expect(validateCacheFunc({})).toBe(true);
    expect(validateCacheFunc([])).toBe(true);
    expect(validateCacheFunc(new Set())).toBe(true);
    expect(validateCacheFunc(new Map())).toBe(true);
    expect(validateCacheFunc(BigInt(9007199254740991))).toBe(false);
  });
});
