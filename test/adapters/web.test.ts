import webAdapter from "../../src/adapters/web";

describe("webAdapter接口测试:", () => {
  beforeAll(() => {
    console.error = () => {}
  });

  test("如果key不存在，getItem 返回null:", async () => {
    const result = await webAdapter.getItem("abc");
    expect(result).toBe(null);
  });

  test("如果key存在，getItem 返回对应值:", async () => {
    await webAdapter.setItem("abc", 2333);
    const result = await webAdapter.getItem("abc");
    expect(result).toEqual(2333);
  });

  test("如果key不合法，webAdapter 各个api将不会处理:", async () => {
    // @ts-ignore
    const res1 = await webAdapter.getItem(123);
    expect(res1).toBe(null);
    // @ts-ignore
    const res2 = await webAdapter.setItem(123);
    expect(res2).toBe(undefined);
    // @ts-ignore
    const res3 = await webAdapter.removeItem(123);
    expect(res3).toBe(undefined);
    // @ts-ignore
    const res4 = await webAdapter.removeItem("abc");
    expect(res4).toBe(undefined);
  });
});
