import { Injectable } from '../core/decorators';
import { HomePageRepository } from '../repositories';
import { BaseService } from './base.service';
import { RedisService } from '../cache';

@Injectable()
export class HomeService extends BaseService {
    constructor(
        private homepageRepository: HomePageRepository,
        redisService: RedisService
    ) {
        super(redisService);
    }

    async get(key: string): Promise<any> {
        const cacheKey = `/home/:${key}`;

        return await this.execute(cacheKey, 84600, () => this.homepageRepository.get(key));
    }
}
