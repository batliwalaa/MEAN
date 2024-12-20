import { Injectable } from '../core/decorators';
import { RedisService } from './redis.service';
import { CacheService } from './cache.service';

@Injectable()
export class CacheManager {
    constructor(private redisService: RedisService) {}

    async delete(filter: string): Promise<void> {
        let cursor = '0';

        do {
            const reply = await this.redisService.scan(cursor, 'MATCH', filter);
            cursor = reply[0];

            reply[1].forEach(async (key: string) => {
                try {
                    await this.redisService.del(key);
                } catch {}
            });
        } while (cursor !== '0');

        await CacheService.delete();
    }

    async get(key: string): Promise<any> {
        return await this.redisService.get(key);
    }
}
