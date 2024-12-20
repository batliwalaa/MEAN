import { Injectable } from '../core/decorators';
import { FooterRepository } from '../repositories/footer.repository';
import { BaseService } from './base.service';
import { RedisService } from '../cache';

@Injectable()
export class FooterService extends BaseService {
    constructor(private footerRepository: FooterRepository, redisService: RedisService) {
        super(redisService);
    }

    async get(): Promise<any> {
        const cacheKey = `site-footer`;

        return await this.execute(cacheKey, 84600, () => this.footerRepository.getAll());
    }
}
