import { Injectable } from "../core/decorators";
import { Lock } from "../core/lock/lock";
import { SequenceRepository } from "../repositories";

@Injectable()
export class SequenceGenerateService {
    constructor(
        private sequenceRepository: SequenceRepository,
        private lock: Lock
    ) {
    }

    public async nextId(): Promise<string> {
        const datacenter = Number(process.env.DATACENTER);
        const worker = Number(process.env.WORKER);
        const key = `generate-next-sequence-${datacenter}-${worker}`;
        try {  
            await this.lock.acquire(key);
            const next = await this.sequenceRepository.next(datacenter, worker);
            await this.lock.release(key);
            return `${datacenter}${worker}-${next}`;
        } catch(e) {
            await this.lock.release(key);
            throw e;
        }
    }
}