import redis, { RedisClient } from 'redis';
import JsonSerializerHandlers from '../loaders/api/jsonSerializer';
import { Injectable } from '../core/decorators';

@Injectable()
export class RedisService {
    private static instance: RedisService;

    public static async createClient(options?: any): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            try {
                if (!RedisService.instance) {
                    RedisService.instance = new RedisService();
                    RedisService.instance.connect(options);
                }

                resolve(true);
            } catch (e) {
                reject(new Error(`ERROR: failed to connect to redis instance, Exception: ${JSON.stringify(e)}`));
            }
        });
    }

    private redisClient: RedisClient;
    private subscriber: RedisClient;

    constructor() {}

    public async hasKey(key: string): Promise<boolean> {
        if (!key) return Promise.reject(new Error('Argument Null: key'));

        return new Promise((resolve, reject) => {
            this.getClient().exists(key, (err, reply) => {
                if (err) reject(err);
                resolve(reply === 1);
            });
        });
    }

    public async scan(cursor: string, operator: string, pattern: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.getClient().scan(cursor, operator, pattern, (err, reply) => {
                if (err) reject(err);
                else resolve(reply);
            });
        });
    }

    public async del(key: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.getClient().del(key, (err, reply) => {
                if (err) reject(err);
                else resolve(true);
            });
        });
    }

    public async getSet<T>(key: string, ttlInSeconds: number, loader: () => Promise<T>): Promise<T> {
        return new Promise(async (resolve, reject) => {
            try {
                let data = key ? await this.get<T>(key) : null;

                if (data) {
                    await this.expireAt(key, ttlInSeconds * 2);
                    resolve(data);
                } else {
                    data = await loader();
                    const json: string = JSON.stringify(data, JsonSerializerHandlers);

                    if (key && json) {
                        await this.set(key, ttlInSeconds === -1 ? 60 : ttlInSeconds * 5, json, ttlInSeconds === -1);
                    }
                    resolve(JSON.parse(json ?? '{}'));
                }
            } catch (e) {
                //TODO: logging
                reject(e);
            }
        });
    }

    public async publish(channel: string, message: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.getClient().publish(channel, message, (err, reply) => {
                    if (err) reject(err);
                    else resolve();
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    public async subscribe(
        channel: string,
        handler: (channel: string, message: string) => Promise<void>
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const subscriber = this.getSubscriber();

            subscriber.on('message', handler);

            subscriber.subscribe(channel, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    public async get<T>(key: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.getClient().get(key, (err, result) => {
                if (err) reject(err);
                else {
                    if (result) resolve(JSON.parse(result));
                    else resolve(null);
                }
            });
        });
    }

    public async set(key: string, seconds: number, data: string, persist: boolean = false): Promise<void> {
        if (!key || process.env.CACHING_ENABLED !== 'true') Promise.resolve();
        else {
            return new Promise((resolve, reject) => {
                this.getClient().setex(key, seconds, data, (err, _) => {
                    if (err) reject(err);
                    else {
                        if (persist) this.getClient().persist(key);
                        resolve();
                    }
                });
            });
        }
    }

    public async setResourceLock(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getClient().set(key, '', (err, _) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    public async releaseResourceLock(key: string): Promise<void> {
        return new Promise((resolve, reject) => {
            this.getClient().del(key, (err, _) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    private connect(options?: any): void {
        this.redisClient = redis.createClient(options);
        this.subscriber = redis.createClient(options);
    }

    private async expireAt(key: string, seconds: number): Promise<void> {
        if (!key) Promise.resolve();
        else {
            return new Promise((resolve, reject) => {
                this.getClient().expire(key, seconds, (err, _) => {
                    if (err) reject(err);
                    else resolve();
                });
            });
        }
    }

    private getSubscriber(): RedisClient {
        return RedisService.instance.subscriber;
    }

    private getClient(): RedisClient {
        return RedisService.instance.redisClient;
    }
}
