import { EventEmitter } from "events";
import { RedisService } from "../../cache";
import { Injectable } from "../decorators";

@Injectable()
export class Lock {
    private eventEmitter: EventEmitter;

    constructor(private resdisService: RedisService) {
        this.eventEmitter = new EventEmitter();
    }

    public async acquire(resource: string): Promise<void> {
        return new Promise<void>(async (resolve, reject) => {
            let hasKey = await this.resdisService.hasKey(resource);

            if (!hasKey) {
                await this.resdisService.setResourceLock(resource);
                
                resolve();
            } else {
                const tryAcquire = async () => {
                    hasKey = await this.resdisService.hasKey(resource);
                    if (!hasKey) {
                        await this.resdisService.setResourceLock(resource);
                        this.eventEmitter.removeListener('release', tryAcquire);
                        resolve();
                    }
                }
                this.eventEmitter.on('release', tryAcquire);
            }
        });
    }

    public async release(resource: string): Promise<void> {
        await this.resdisService.releaseResourceLock(resource);
        
        setImmediate(() => this.eventEmitter.emit('release'));
    }
}
