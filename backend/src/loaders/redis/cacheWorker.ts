import { RedisService, CacheService } from '../../cache';
import { PubSubChannelKeys } from '../../keys/redis-pub-sub-channel.keys';
import { CacheKeys } from '../../keys/cacheKeys';
import { CacheItem } from '../../models/cacheItem';
import { ProductRepository, UserRepository } from '../../repositories';

// @ts-ignore
export default async (environment: Environment) => {
    const redisService = new RedisService();
    const defaultCacheTTLInSeconds = environment.defaultCacheTTLInSeconds;

    await redisService.subscribe(PubSubChannelKeys.CacheLoaderChannel, async (channel: string, message: string) => {
        if (channel !== PubSubChannelKeys.CacheLoaderChannel) return;

        try {
            const msg = JSON.parse(message) as CacheItem;
            const producteRepository = new ProductRepository(environment);
            const userRepository = new UserRepository();

            if (!(await CacheService.hasKey(msg.Key))) {
                try {
                    switch (msg.CacheType) {
                        case CacheKeys.CacheFilters:
                            await CacheService.Set(msg.Key, -1, async () =>
                                producteRepository.getFilters(msg.Type, msg.Brand, msg.SubType)
                            );
                            break;
                        case CacheKeys.CacheQuickSearch:
                            await CacheService.Set(msg.Key, defaultCacheTTLInSeconds, async () =>
                                producteRepository.quickSearch(msg.PageNumber, msg.Term)
                            );
                            break;
                        case CacheKeys.CacheGetProductsByType:
                            await CacheService.Set(msg.Key, defaultCacheTTLInSeconds, async () =>
                                producteRepository.getProductByType(msg.Type, msg.PageNumber)
                            );
                            break;
                        case CacheKeys.CachePostSearch:
                            await CacheService.Set(msg.Key, defaultCacheTTLInSeconds, async () =>
                                producteRepository.search(msg.PageNumber, msg.searchMap)
                            );
                            break;
                        case CacheKeys.CacheUser:
                            await CacheService.Set(msg.Key, defaultCacheTTLInSeconds, async () =>
                                userRepository.getAll()
                            );
                            break;
                    }
                } catch (e) {
                }
            }
        } catch (e) {
        }
    });
};
