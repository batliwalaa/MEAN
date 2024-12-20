import camelize from './camelCase';
import { CacheService, RedisService } from '../cache';
import { Response } from 'express';
import { CacheItem } from '../models/cacheItem';
import { PubSubChannelKeys } from '../keys/redis-pub-sub-channel.keys';

const execute = async function <T>(
    res: Response,
    cacheKey: string,
    ttlInSeconds: number,
    func: () => Promise<T>,
    cacheItem: CacheItem = undefined,
    filter: (data: T) => Promise<T> = undefined
): Promise<void> {
    let result: T = await CacheService.GetSet<T>(cacheKey, ttlInSeconds, func);

    if (cacheItem) {
        const redisService = new RedisService();

        await redisService.publish(PubSubChannelKeys.CacheLoaderChannel, JSON.stringify(cacheItem));
    }

    if (filter) {
        result = await filter(result);
    }

    res.json(camelize(result)).end();

    return Promise.resolve();
};

export default execute;
