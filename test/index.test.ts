import * as bluebird from 'bluebird'
import cacheStrategy, { CacheStrategy, webAdapter } from "../src";
import sleep from "./sleep";

describe("开始测试", () => {

  beforeAll(() => {
    // @ts-ignore
    global.Promise.any = bluebird.any
  });

  test("测试入口", () => {
    cacheStrategy;
    expect(true).toBe(true);
  });

  test("cacheStrategy.useConfig:", () => {
    cacheStrategy.useConfig({
      prefix: "test-prefix",
    });
    expect(cacheStrategy.config.prefix).toBe("test-prefix");
  });

  test("cacheStrategy.staleWhileRevalidate:", async () => {
    let count = 1;
    function addCount() {
      count += 1;
      return count;
    }
    const addCountCache = cacheStrategy.staleWhileRevalidate(addCount, {
      currentSaveKey: 'demokey'
    });
    let res = await addCountCache();
    expect(res).toEqual(2);
    expect(count).toEqual(2);
    await sleep();
    res = await addCountCache();
    expect(res).toEqual(2);
    expect(count).toEqual(3);
    await sleep();
    res = await addCountCache();
    expect(res).toEqual(3);
    expect(count).toEqual(4);
  });

  test("cacheStrategy.cacheOnly:", async () => {
    let fakeFunc = jest.fn();
    let count = 1;
    function addCount() {
      count += 1;
      fakeFunc();
      return count;
    }
    const addCountCache = cacheStrategy.cacheOnly(addCount);
    const res = await addCountCache();
    expect(count).toBe(1);
    expect(res).toBe(null);
    expect(fakeFunc).not.toBeCalled();
  });

  test("cacheStrategy.apiOnly", async () => {
    let fakeFunc = jest.fn();
    let count = 1;
    function addCount() {
      count += 1;
      fakeFunc();
      return count;
    }
    const addCountCache = cacheStrategy.apiOnly(addCount);
    const res = await addCountCache();
    expect(res).toBe(2);
    expect(count).toBe(2);
    expect(fakeFunc).toBeCalled();
  });

  test("cacheStrategy.cacheFirst:", async () => {
    let fakeFunc = jest.fn();
    let count = 1;
    function addCount() {
      count += 1;
      fakeFunc();
      return count;
    }
    const addCountCache = cacheStrategy.cacheFirst(addCount);
    const res = await addCountCache();
    expect(count).toBe(2);
    expect(res).toBe(2);
    expect(fakeFunc).toBeCalledTimes(1);
    await sleep(1500);
    const res2 = await addCountCache();
    expect(count).toBe(2);
    expect(res2).toBe(2);
    expect(fakeFunc).toBeCalledTimes(1);
  });

  test("cacheStrategy.apiFirst", async () => {
    let fakeFunc = jest.fn();
    let count = 1;
    function addCount() {
      count += 1;
      fakeFunc();

      if (count >= 3) {
        throw new Error("接口调用失败");
      }
      return count;
    }
    const addCountCache = cacheStrategy.apiFirst(addCount);

    const res = await addCountCache();
    expect(count).toBe(2);
    expect(res).toBe(2);
    expect(fakeFunc).toBeCalledTimes(1);
    const res2 = await addCountCache();
    expect(count).toBe(3);
    expect(res2).toBe(2);
    expect(fakeFunc).toBeCalledTimes(2);
  });

  test("cacheStrategy.cacheAndApiRace", async () => {
    let fakeFunc = jest.fn();
    let count = 1;
    async function addCount() {
      await sleep();
      count += 1;
      fakeFunc();
      return count;
    }
    const addCountCache = cacheStrategy.cacheAndApiRace(addCount);
    const res = await addCountCache();
    expect(count).toBe(1);
    expect(res).toBe(null);
    expect(fakeFunc).toBeCalledTimes(0);
    await sleep(1500)
    const res2 = await addCountCache();
    expect(count).toBe(2);
    expect(res2).toBe(2);
    expect(fakeFunc).toBeCalledTimes(1);
  });

  test("cacheStrategy.cacheThenUpdate", async () => {
    let fakeFunc = jest.fn();
    let count = 1;
    async function addCount() {
      count += 1;
      fakeFunc();
      return count;
    }

    let fakeFunc2 = jest.fn();
    const addCountCache = cacheStrategy.cacheThenUpdate(addCount, {
      updateCallback: (re) => {
        fakeFunc2(re)
      }
    });
    const res = await addCountCache();
    expect(res).toBe(2);
    expect(count).toBe(2);
    await sleep();
    expect(fakeFunc2).not.toBeCalled();
    const res2 = await addCountCache();
    expect(res2).toBe(2);
    expect(count).toBe(3);
    await sleep();
    expect(fakeFunc2).toBeCalledWith(3);
  })

  test('clear 功能测试:', async () => {
    const ncache = new CacheStrategy({
      adapter: webAdapter,
      prefix: 'web-prefix/',
    })

    let fakeFunc = jest.fn();
    let count = 1;
    async function addCount(n: number) {
      count += n;
      fakeFunc();
      return count;
    }
    const addCountCache = ncache.cacheFirst(addCount);
    const res = await addCountCache(1);
    expect(count).toBe(2);
    expect(res).toBe(2);

    const storage = ncache.getStorage();
    const allKeys = await webAdapter.getAllKeys();

    expect(!!allKeys.find(k => k.includes('web-prefix/'))).toBe(true);
    await storage.clear();
    const allKeys2 = await webAdapter.getAllKeys();
    expect(!!allKeys2.find(k => k.includes('web-prefix/'))).toBe(false);
  })
});
