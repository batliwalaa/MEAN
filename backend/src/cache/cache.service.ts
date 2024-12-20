import NodeCache from 'node-cache';
import { RedisService } from './redis.service';
import { Injectable } from '../core/decorators';

@Injectable()
export class CacheService {
    private static instance: CacheService;

    public static async init(): Promise<boolean> {
        const host = process.env.REDIS_HOST;
        const port = process.env.REDIS_PORT;
        const options = host ? { host, port } : null;
        
        return new Promise<boolean>(async (resolve, reject) => {
            try {
                if (!CacheService.instance) {
                    CacheService.instance = new CacheService();
                    await RedisService.createClient(options);
                }

                resolve(true);
            } catch (e) {
                reject(new Error(`ERROR: failed to instantiate cache service, Exception: ${JSON.stringify(e)}`));
            }
        });
    }

    public static async GetSet<T>(key: string, ttlInSeconds: number = -1, loader: () => Promise<T>): Promise<T> {
        return new Promise(async (resolve, reject) => {
            const item: string = key ? CacheService.instance.cache.get(key) : null;

            if (item) {
                resolve(JSON.parse(item) as T);
            } else {
                const redis = new RedisService();
                try {
                    const data = await redis.getSet(key, ttlInSeconds, loader);

                    if (key && data && process.env.CACHING_ENABLED === 'true') {
                        CacheService.instance.cache.set(key, JSON.stringify(data), ttlInSeconds);
                    }
                    resolve(data);
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public static async Set<T>(key: string, ttlInSeconds: number = -1, loader: () => Promise<T>): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const redis = new RedisService();
            try {
                const data = await redis.getSet(key, ttlInSeconds, loader);
                if (process.env.CACHING_ENABLED === 'true') {
                    CacheService.instance.cache.set(key, JSON.stringify(data), ttlInSeconds);
                }

                resolve();
            } catch (e) {
                reject(e);
            }
        });
    }

    public static async hasKey(key: string): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (CacheService.instance.cache.has(key)) {
                resolve(true);
            } else {
                try {
                    const hasKey: boolean = await new RedisService().hasKey(key);
                    resolve(hasKey);
                } catch (e) {
                    reject(e);
                }
            }
        });
    }

    public static async delete(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            const keys = CacheService.instance.cache.keys();

            keys.forEach((k) => {
                CacheService.instance.cache.del(k);
            });
            resolve();
        });
    }

    private cache: NodeCache;

    constructor() {
        this.cache = new NodeCache();
    }
}
