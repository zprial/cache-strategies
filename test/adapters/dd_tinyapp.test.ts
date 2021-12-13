import ddAdapter from "../../src/adapters/dd_tinyapp";

describe("ddAdapter接口测试:", () => {
  beforeAll(() => {
    console.error = () => {}

    class LocalStorageMock {
      store: any
      constructor() {
        this.store = {};
      }
    
      clear() {
        this.store = {};
      }
    
      getStorageSync(param: { key: string }) {
        return this.store[param.key] || null;
      }
    
      setStorageSync(param: { key: string, data: any }) {
        this.store[param.key] = param.data;
      }
    
      removeStorageSync(param: {key: string}) {
        delete this.store[param.key];
      }
    };
    // @ts-ignore
    global.wx = new LocalStorageMock()
  });

  test("如果key不存在，getItem 返回null:", async () => {
    const result = await ddAdapter.getItem("abc");
    expect(result).toBe(null);
  });

  test("如果key存在，getItem 返回对应值:", async () => {
    await ddAdapter.setItem("abc", 2333);
    const result = await ddAdapter.getItem("abc");
    expect(result).toEqual(2333);
  });

  test("如果key不合法，ddAdapter 各个api将不会处理:", async () => {
    // @ts-ignore
    const res1 = await ddAdapter.getItem(123);
    expect(res1).toBe(null);
    // @ts-ignore
    const res2 = await ddAdapter.setItem(123);
    expect(res2).toBe(undefined);
    // @ts-ignore
    const res3 = await ddAdapter.removeItem(123);
    expect(res3).toBe(undefined);
    // @ts-ignore
    const res4 = await ddAdapter.removeItem("abc");
    expect(res4).toBe(undefined);
  });
});
