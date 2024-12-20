import { Injectable } from "../core/decorators";
import { BaseService } from "./base.service";
import { RedisService } from "../cache";
import { ResourceRepository } from "../repositories/resource.repository";
import { Resource } from "../models";

@Injectable()
export class ResourceService extends BaseService {
    constructor (
        redisService: RedisService,
        private resourceRepository: ResourceRepository
    ) {
        super (redisService);
    }

    public async get(resourceKey: string, language: string): Promise<Resource> {
        return await this.resourceRepository.get(resourceKey, language);
    }
}
