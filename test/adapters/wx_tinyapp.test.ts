import wxAdapter from "../../src/adapters/wx_tinyapp";

describe("wxAdapter接口测试:", () => {
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
    
      getStorageSync(key: string) {
        return this.store[key] || null;
      }
    
      setStorageSync(key: string, value: any) {
        this.store[key] = value;
      }
    
      removeStorageSync(key: string) {
        delete this.store[key];
      }
    };
    // @ts-ignore
    global.wx = new LocalStorageMock()
  });

  test("如果key不存在，getItem 返回null:", async () => {
    const result = await wxAdapter.getItem("abc");
    expect(result).toBe(null);
  });

  test("如果key存在，getItem 返回对应值:", async () => {
    await wxAdapter.setItem("abc", 2333);
    const result = await wxAdapter.getItem("abc");
    expect(result).toEqual(2333);
  });

  test("如果key不合法，wxAdapter 各个api将不会处理:", async () => {
    // @ts-ignore
    const res1 = await wxAdapter.getItem(123);
    expect(res1).toBe(null);
    // @ts-ignore
    const res2 = await wxAdapter.setItem(123);
    expect(res2).toBe(undefined);
    // @ts-ignore
    const res3 = await wxAdapter.removeItem(123);
    expect(res3).toBe(undefined);
    // @ts-ignore
    const res4 = await wxAdapter.removeItem("abc");
    expect(res4).toBe(undefined);
  });
});
