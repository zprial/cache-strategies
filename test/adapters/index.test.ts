import webAdapter from "../../src/adapters/web";
import wxAdapter from "../../src/adapters/wx_tinyapp";
import getDefaultAdapter from "../../src/adapters"

describe("webAdapter 选用测试:", () => {
  test('选用 webAdapter', () => {
    const adapter = getDefaultAdapter()
    expect(adapter).toStrictEqual(webAdapter)
  })
});

// describe("wxAdapter 选用测试:", () => {
//   beforeAll(() => {
//     class LocalStorageMock {
//       store: any
//       constructor() {
//         this.store = {};
//       }
    
//       clear() {
//         this.store = {};
//       }
    
//       getStorageSync(key: string) {
//         return this.store[key] || null;
//       }
    
//       setStorageSync(key: string, value: any) {
//         this.store[key] = value;
//       }
    
//       removeStorageSync(key: string) {
//         delete this.store[key];
//       }
//     };
//     // @ts-ignore
//     global.wx = new LocalStorageMock()
//     global.window = null
//   });
//   test('选用 wxAdapter', () => {
//     const adapter = getDefaultAdapter()
//     expect(adapter.type).toBe(wxAdapter.type)
//   })
// });
