# @hd/cache-strategies

平台无关的缓存策略

## 测试覆盖

[![branches coverage](./coverage/badge-branches.svg)](./coverage/lcov-report/index.html)
[![functions coverage](./coverage/badge-functions.svg)](./coverage/lcov-report/index.html)
[![lines coverage](./coverage/badge-lines.svg)](./coverage/lcov-report/index.html)
[![statements coverage](./coverage/badge-statements.svg)](./coverage/lcov-report/index.html)

## Usage

### 安装

```
 yarn add @hd/cache-strategies
```

### Api

* cacheStrategy
  * useConfig
  * staleWhileRevalidate
  * cacheOnly
  * apiOnly
  * cacheFirst
  * apiFirst
  * cacheAndApiRace
  * cacheThenUpdate
* CacheStrategy Class


* Stale-while-revalidate
* Cache only
* Network only
* Cache First (Cache, falling back to network)
* Network First (Network falling back to cache)
* Cache and network race
* Cache then network to update
