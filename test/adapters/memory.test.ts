import { MemoryAdapter } from "../../src/adapters/memory";

const memoryAdapter = new MemoryAdapter(Number.MAX_SAFE_INTEGER)
describe("memoryAdapter接口测试:", () => {
  beforeAll(() => {
    console.error = () => {}
  });
  beforeEach(() => {
    memoryAdapter.clear()
  });

  test("如果key不存在，getItem 返回null:", async () => {
    const result = await memoryAdapter.getItem("abc");
    expect(result).toBe(null);
  });

  test("如果key存在，getItem 返回对应值:", async () => {
    await memoryAdapter.setItem("abc", 2333);
    const result = await memoryAdapter.getItem("abc");
    expect(result).toEqual(2333);
  });

  test("如果key不合法，memoryAdapter 各个api将不会处理:", async () => {
    // @ts-ignore
    const res1 = await memoryAdapter.getItem(123);
    expect(res1).toBe(null);
    // @ts-ignore
    const res2 = await memoryAdapter.setItem(123);
    expect(res2).toBe(undefined);
    // @ts-ignore
    const res3 = await memoryAdapter.removeItem(123);
    expect(res3).toBe(undefined);
    // @ts-ignore
    const res4 = await memoryAdapter.removeItem("abc");
    expect(res4).toBe(undefined);
  });
});
