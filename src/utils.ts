import { CacheStrategyConfig } from './types'

export const mergeConfig = (
  con1: CacheStrategyConfig,
  con2: Partial<CacheStrategyConfig>
): CacheStrategyConfig => {
  return {
    ...con1,
    ...con2,
  };
};
