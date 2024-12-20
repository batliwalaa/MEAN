import { RedisService } from '../../cache';
import { CacheKeys } from '../../keys/cacheKeys';
import { CacheItem } from '../../models/cacheItem';
import { PubSubChannelKeys } from '../../keys/redis-pub-sub-channel.keys';

export default async () => {
    const cacheItems: Array<CacheItem> = [
        { CacheType: CacheKeys.CacheUser, Key: '/user/getusers/' },
        /* { CacheType: CacheKeys.CacheGetProductsByType, Key: ':shirts/:1', Type: 'Shirts', PageNumber: 1 },
        { CacheType: CacheKeys.CacheGetProductsByType, Key: ':ties/:1', Type: 'Ties', PageNumber: 1 },
        { CacheType: CacheKeys.CacheGetProductsByType, Key: ':shoes/:1', Type: 'Shoes', PageNumber: 1 },
        { CacheType: CacheKeys.CacheGetProductsByType, Key: ':coats/:1', Type: 'Coats', PageNumber: 1 },
        { CacheType: CacheKeys.CacheGetProductsByType, Key: ':knitwear/:1', Type: 'Knitwear', PageNumber: 1 },
        { CacheType: CacheKeys.CacheGetProductsByType, Key: ':accessories/:1', Type: 'Accessories', PageNumber: 1 },
        { CacheType: CacheKeys.CacheGetProductsByType, Key: ':trousers/:1', Type: 'Trousers', PageNumber: 1 },

        { CacheType: CacheKeys.CacheFilters, Key: 'filters:shirts', Type: 'Shirts' },
        { CacheType: CacheKeys.CacheFilters, Key: 'filters:shirts|charlesknight', Type: 'Shirts', Brand: 'Charles Knight' },
        { CacheType: CacheKeys.CacheFilters, Key: 'filters:shirts|formalshirts', Type: 'Shirts', SubType: 'Formal Shirts' },
        { CacheType: CacheKeys.CacheFilters, Key: 'filters:shirts|charlesknight|formalshirts', Type: 'Shirts', Brand: 'Charles Knight', SubType: 'Formal Shirts' },
        { CacheType: CacheKeys.CacheFilters, Key: 'filters:shirts|businesscasualshirts', Type: 'Shirts', SubType: 'Business Casual Shirts' },
        { CacheType: CacheKeys.CacheFilters, Key: 'filters:shirts|charlesknight|businesscasualshirts', Type: 'Shirts', Brand: 'Charles Knight', SubType: 'Business Casual Shirts' } */
    ];
    const redisService = new RedisService();

    cacheItems.forEach(async (item) => {
        await redisService.publish(PubSubChannelKeys.CacheLoaderChannel, JSON.stringify(item));
    });
};
