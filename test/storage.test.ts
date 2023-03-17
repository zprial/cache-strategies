import Storage from '../src/core/Storage'
import getAdapter from '../src/adapters'
import { CACHE_PREFIX } from '../src/constants'
import sleep from './sleep'

describe('测试 storage 功能准确', () => {
  let storage = new Storage();

  test('storage.getItem', async () => {
    let res = await storage.getItem('test');
    expect(res).toBe(null);
  });

  test('storage.getItem', async () => {
    let res = await storage.getItem('test');
    expect(res).toBe(null);
  });

  test('storage.getItem maxAge', async () => {
    await storage.setItem('hello', 'world', {
      maxAge: 3000
    });
    let res2 = await storage.getItem('hello');
    expect(res2).toBe('world');
    await sleep(3000);
    let res3 = await storage.getItem('hello');
    expect(res3).toBe(null);
  });

  test('storage.getItem expires', async () => {
    await storage.setItem('hello2', 'world', {
      expires: new Date('2022-02-28 12:17:30')
    });
    let res2 = await storage.getItem('hello2');
    expect(res2).toBe(null);
  });

  test('storage.getItem maxAge > expires', async () => {
    await storage.setItem('hello23', 'world', {
      maxAge: 60 * 60 * 1000,
      expires: new Date('2022-02-28 12:17:30')
    });
    let res2 = await storage.getItem('hello23');
    expect(res2).toBe('world');
  });

  test('storage.clear', async () => {
    await storage.clear();
    await storage.setItem('a', 'b');
    await storage.setItem('b', 'c');
    await storage.setItem('c', 'd');

    expect(await storage.getItem('a')).toEqual('b');
    expect(await storage.getItem('b')).toEqual('c');
    expect(await storage.getItem('c')).toEqual('d');

    await storage.clear();
    expect(await storage.getItem('a')).toEqual(null);
    expect(await storage.getItem('b')).toEqual(null);
    expect(await storage.getItem('c')).toEqual(null);
  })

  test('storage.setItem: checkAllExpired', async () => {
    const prefix = 'demos/'
    const adapters = getAdapter();
    await adapters.setItem(CACHE_PREFIX + prefix, {
      expires: new Date('2022-02-28 12:17:30'),
      value: 'hello world',
      __cache_strategy: true,
    });
    expect((await adapters.getItem(CACHE_PREFIX + prefix)).value).toEqual('hello world');
    const storage = new Storage({
      prefix: prefix
    });

    await sleep(2000);
    expect(await storage.getItem(CACHE_PREFIX + prefix)).toEqual(null);
  })
});
