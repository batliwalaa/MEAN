import { Injectable } from '../core/decorators';
import { ShoppingCartRepository } from '../repositories';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import { DeliverySlotType, ShoppingCart } from '../models';

@Injectable()
export class ShoppingCartService extends BaseService {
    constructor(private shoppingCartRepository: ShoppingCartRepository, redisService: RedisService) {
        super(redisService);
    }

    public async getBySessionID(sessionID: string): Promise<ShoppingCart> {
        const cacheKey = `shopping_cart-${sessionID}`;

        return await this.execute(cacheKey, 1000 * 60 * 60, () =>
            this.shoppingCartRepository.getBySessionID(sessionID)
        );
    }

    public async getByUserID(userID: string): Promise<ShoppingCart> {
        const cacheKey = `shopping_cart-${userID}`;

        return await this.execute(cacheKey, 1000 * 60 * 60, () => this.shoppingCartRepository.getByUserID(userID));
    }

    public async getByID(id: string): Promise<ShoppingCart> {
        const cacheKey = `shopping_cart-${id}`;

        return await this.execute(cacheKey, 1000 * 60 * 60, () => this.shoppingCartRepository.getByID(id));
    }

    public async create(sessionID: string, userID?: string): Promise<ShoppingCart> {
        return await this.shoppingCartRepository.create(sessionID, userID);
    }

    public async update(cart: ShoppingCart): Promise<void> {
        await this.shoppingCartRepository.update(cart);
    }

    public async updateSlot(shoppingCartID: string, slotID: string, slotType: DeliverySlotType): Promise<void> {
        await this.shoppingCartRepository.updateSlot(shoppingCartID, slotID, slotType);
    }

    public async updateSessionID(shoppingCartID: string, sessionID: string): Promise<void> {
        await this.shoppingCartRepository.updateSessionID(shoppingCartID, sessionID);
    }

    public async deleteCart(shoppingCartID: string, userID: string): Promise<void> {
        await this.shoppingCartRepository.delete(shoppingCartID, userID);
    }

    public async setPaymentInProgress(shoppingCartID: string, userID: string): Promise<void> {
        await this.shoppingCartRepository.setPaymentInProgress(shoppingCartID, userID);
    }
}
