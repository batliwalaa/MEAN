import { RedisService, CacheService } from '../cache';
import { CacheItem } from '../models/cacheItem';
import { PubSubChannelKeys } from '../keys/redis-pub-sub-channel.keys';
import { Injector } from '../core/di/injector';

export abstract class BaseService {
    constructor(protected redisService: RedisService) {}

    protected get environment(): any {
        return Injector.getEnvironmentInstance();
    }

    protected async execute<T>(
        cacheKey: string,
        ttlInSeconds: number,
        func: () => Promise<T>,
        cacheItem: CacheItem = undefined,
        filter: (data: T) => Promise<T> = undefined
    ): Promise<any> {
        let result: T = await CacheService.GetSet<T>(cacheKey, ttlInSeconds, func);

        if (cacheItem) {
            await this.redisService.publish(PubSubChannelKeys.CacheLoaderChannel, JSON.stringify(cacheItem));
        }

        if (filter) {
            result = await filter(result);
        }

        return Promise.resolve(result);
    }

    protected async executeAll<T>(
        cacheKey: string,
        ttlInSeconds: number,
        funcs: Array<() => Promise<T>>,
        aggregator: (data: Array<any>) => Promise<T>,
        filter: (data: T) => Promise<T> = undefined
    ): Promise<any> {
        const promises: Array<Promise<any>> = [];

        funcs.forEach(async (f, index) => {
            promises.push(CacheService.GetSet<T>(`${cacheKey}.${index}`, ttlInSeconds, f));
        });

        const resultItems = await Promise.all(promises);

        let aggregatedData = await aggregator(resultItems);

        if (filter) {
            aggregatedData = await filter(aggregatedData);
        }

        return Promise.resolve(aggregatedData);
    }
}
