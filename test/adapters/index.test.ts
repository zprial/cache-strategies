import WXLocalStorageMock from "../../mock/WXLocalStorageMock";
import DDLocalStorageMock from "../../mock/DDLocalStorageMock";

import {
  webAdapter,
  wxAdapter,
  ddAdapter,
  MemoryAdapter,
  MapAdapter,
  wxAsyncAdapter,
  ddAsyncAdapter,
  webSessionAdapter
} from "../../src";
import getDefaultAdapter from "../../src/adapters";

describe("adapter 适配测试:", () => {
  beforeAll(() => {
    console.error = () => {};

    // @ts-ignore
    global.wx = new WXLocalStorageMock();
    // @ts-ignore
    global.dd = new DDLocalStorageMock();
  });

  beforeEach(() => {
    // @ts-ignore
    wx.clear();
    // @ts-ignore
    dd.clear();
  })

  let adapters = [
    webAdapter,
    webSessionAdapter,
    wxAdapter,
    ddAdapter,
    new MemoryAdapter(),
    new MapAdapter(),
    wxAsyncAdapter,
    ddAsyncAdapter,
  ];
  for (let adapter of adapters) {
    describe(`${adapter.type} 适配测试:`, () => {
      test("获取所有的key,如果支持的话, getAllKeys:", async () => {
        await adapter.setItem("a", 1);
        await adapter.setItem("b", 2);
        await adapter.setItem("c", 3);
        // @ts-ignore
        if (typeof adapter.getAllKeys === "function") {
          // @ts-ignore
          const keys = await adapter.getAllKeys();
          expect(keys).toEqual(["a", "b", "c"]);
        }
      });

      test("如果key不存在，getItem 返回 undefined 或 null:", async () => {
        const result = await adapter.getItem("abc");
        expect([undefined, null]).toContain(result);
      });

      test("如果key存在，getItem 返回对应值:", async () => {
        await adapter.setItem("abc", 2333);
        const result = await adapter.getItem("abc");
        expect(result).toEqual(2333);
      });

      test("如果key不合法，adapter 各个api将不会处理:", async () => {
        // @ts-ignore
        const res1 = await adapter.getItem(123);
        expect(res1).toBe(undefined);
        // @ts-ignore
        const res2 = await adapter.setItem(123);
        expect(res2).toBe(undefined);
        // @ts-ignore
        const res3 = await adapter.removeItem(123);
        expect(res3).toBe(undefined);
        // @ts-ignore
        const res4 = await adapter.removeItem("abcdefs");
        expect([undefined, false]).toContain(res4);
      });
    });
  }
});

describe("webAdapter 选用测试:", () => {
  test("默认选用 webAdapter", () => {
    const adapter = getDefaultAdapter();
    expect(adapter).toStrictEqual(webAdapter);
  });
});
