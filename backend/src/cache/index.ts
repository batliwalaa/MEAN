import { CacheService } from "./cache.service";

export * from './redis.service';
export * from './cache.service';

export default async (options?: any) => {
    await CacheService.init();
};
