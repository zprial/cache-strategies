import webStorage from "../../src/adapters/web";

describe("webStorage接口测试:", () => {
  beforeAll(() => {
    console.error = console.log;
  });

  test("如果key不存在，getItem 返回null:", async () => {
    const result = await webStorage.getItem("abc");
    expect(result).toBe(null);
  });

  test("如果key存在，getItem 返回对应值:", async () => {
    await webStorage.setItem("abc", 2333);
    const result = await webStorage.getItem("abc");
    expect(result).toEqual(2333);
  });

  test("如果key不合法，webStorage 各个api将不会处理:", async () => {
    // @ts-ignore
    const res1 = await webStorage.getItem(123);
    expect(res1).toBe(null);
    // @ts-ignore
    const res2 = await webStorage.setItem(123);
    expect(res2).toBe(undefined);
    // @ts-ignore
    const res3 = await webStorage.removeItem(123);
    expect(res3).toBe(undefined);
    // @ts-ignore
    const res4 = await webStorage.removeItem("abc");
    expect(res4).toBe(undefined);
  });
});
