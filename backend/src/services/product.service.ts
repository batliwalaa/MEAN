import { Injectable } from '../core/decorators';
import { ProductRepository } from '../repositories/product.repository';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import { CacheKeys } from '../keys/cacheKeys';
import { SearchMap } from '../models/search-map';
import JsonSerializerHandlers from '../loaders/api/jsonSerializer';
@Injectable()
export class ProductService extends BaseService {
    constructor(private productRepository: ProductRepository, redisService: RedisService) {
        super(redisService);
    }

    public async getFilters(type: string, subtype: string = undefined, brand: string = undefined): Promise<any> {
        const cacheKey = `filters:${type.replace(/\s/g, '')}${brand ? '|' + brand.replace(/\s/g, '') : ''}${
            subtype ? '|' + subtype.replace(/\s/g, '') : ''
        }`;

        return await this.execute(cacheKey, -1, () => this.productRepository.getFilters(type, brand, subtype));
    }

    public async getProductById(id: string): Promise<any> {
        return await this.execute(null, null, () => this.productRepository.getProductById(id));
    }

    public async getProductByType(type: string, pn: number): Promise<any> {
        const cacheKey = `/:${type}/:${pn}`.toLowerCase();

        return await this.execute(
            cacheKey,
            this.environment.defaultCacheTTLInSeconds,
            () => (type ? this.productRepository.getProductByType(type, pn) : this.productRepository.getAll()),
            {
                CacheType: CacheKeys.CacheGetProductsByType,
                PageNumber: pn + 1,
                Type: type,
                Key: `/:${type}/:${pn + 1}`.toLowerCase(),
            }
        );
    }

    public async quickSearch(term: string, pageNumber: number): Promise<any> {
        const cacheKey = `/search/:${term}/:${pageNumber}`.toLowerCase();

        return await this.execute(
            cacheKey,
            this.environment.defaultCacheTTLInSeconds,
            () => this.productRepository.quickSearch(pageNumber, term),
            {
                CacheType: CacheKeys.CacheQuickSearch,
                PageNumber: pageNumber + 1,
                Term: term,
                Key: `/search/:${term}/:${pageNumber + 1}`.toLowerCase(),
            }
        );
    }

    public async search(searchMap: SearchMap, pageNumber: number): Promise<any> {
        const cacheKey = `/search/:${pageNumber}/${JSON.stringify(searchMap, JsonSerializerHandlers)}`.toLowerCase();

        return await this.execute(
            cacheKey,
            this.environment.defaultCacheTTLInSeconds,
            () => this.productRepository.search(pageNumber, searchMap),
            {
                CacheType: CacheKeys.CachePostSearch,
                Key: `/search/:${pageNumber + 1}/${JSON.stringify(searchMap, JsonSerializerHandlers)}`.toLowerCase(),
                PageNumber: pageNumber + 1,
                searchMap,
            }
        );
    }

    public async getSizes(productID: string): Promise<any> {
        return await this.productRepository.getSizes(productID);
    }
}
