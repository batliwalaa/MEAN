import { Injectable } from '../core/decorators';
import { AddressRepository } from '../repositories/address.repository';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import { Address } from '../models';

@Injectable()
export class AddressService extends BaseService {
    constructor(private addressRepository: AddressRepository, redisService: RedisService) {
        super(redisService);
    }

    async getForUser(userId: string): Promise<any> {
        const cacheKey = `/address/getforuser/:${userId}`;

        return await this.execute(cacheKey, 84600, () => this.addressRepository.getForUser(userId));
    }

    async get(id: string): Promise<any> {
        const cacheKey = `/address/get/:${id}`;

        return await this.execute(cacheKey, 84600, () => this.addressRepository.get(id));
    }


    async save(address: Address): Promise<string> {
        return await this.addressRepository.save(address);
    }

    async delete(id: string): Promise<void> {
        await this.addressRepository.delete(id);
    }
}
