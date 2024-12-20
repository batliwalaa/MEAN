import { Injectable } from '../core/decorators';
import { LoyaltyPointRepository } from '../repositories';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import { LoyaltyPoint } from '../models';
import { Logger } from '../core/structured-logging/logger';
import { Logging } from '../core/structured-logging/log-manager';
import { Lock } from '../core/lock/lock';

@Injectable()
export class LoyaltyPointService extends BaseService {
    private logger: Logger;

    constructor(
        private loyaltyPointRepository: LoyaltyPointRepository,
        private lock: Lock,
        redisService: RedisService
    ) {
        super(redisService);
        this.logger = Logging.getLogger(`${this.constructor.name}`);
    }

    async save(orderID: string, userID: string, points: number): Promise<void> {
        if (!this.environment.loyaltyEnabled) return Promise.resolve();

        const today = new Date();
        try {
            await this.lock.acquire(`loyaltypoint-${userID}`);
            await this.loyaltyPointRepository.save({
                _id: null,
                active: true,
                availablePoints: points,
                createdBy: userID,
                createdDate: today,
                modifiedBy: userID,
                modifiedDate: today,
                orderID: orderID,
                points: points,
                redeems: [],
                userID: userID,
                reservedPoints: 0,
                reservedRedeems: []
            });
            await this.lock.release(`loyaltypoint-${userID}`);
        } catch(e) {
            await this.lock.release(`loyaltypoint-${userID}`);
            throw e;
        }
    }

    async getForUser(userID: string): Promise<Array<LoyaltyPoint>> {
        if (!this.environment.loyaltyEnabled) return Promise.resolve([]);

        return await this.loyaltyPointRepository.getForUser(userID);
    }

    async redeem(userID: string, orderID: string): Promise<void> {
        if (!this.environment.loyaltyEnabled) return Promise.resolve();

        try {
            await this.lock.acquire(`loyaltypoint-${userID}`);
            await this.loyaltyPointRepository.redeem(userID, orderID);
            await this.lock.release(`loyaltypoint-${userID}`);
        } catch(e) {
            await this.lock.release(`loyaltypoint-${userID}`);
            throw e;
        }
    }

    async clearReserved(userID: string, orderID: string): Promise<void> {
        if (!this.environment.loyaltyEnabled) return Promise.resolve();

        try {
            await this.lock.acquire(`loyaltypoint-${userID}`);
            await this.loyaltyPointRepository.clearReserved(userID, orderID);
            await this.lock.release(`loyaltypoint-${userID}`);
        } catch(e) {
            await this.lock.release(`loyaltypoint-${userID}`);
            throw e;
        }
    }

    async reserve(userID: string, orderID: string, points: number): Promise<void> {
        if (!this.environment.loyaltyEnabled) return Promise.resolve();

        try {
            await this.lock.acquire(`loyaltypoint-${userID}`);
            const loyaltyPoints = (await this.getLoyaltyPoints(userID)).loyaltyPoints;
            let pointsToRedeem = points;

            while (pointsToRedeem > 0 && loyaltyPoints.length > 0) {
                const lp = loyaltyPoints.shift();
            
                const reservedPoints = lp.availablePoints >= pointsToRedeem ? pointsToRedeem : lp.availablePoints;
                pointsToRedeem -= reservedPoints;

                this.logger.info(`Reserve redeem points: userID: ${userID}, points: ${reservedPoints}, loyaltyPointID: ${lp._id.toString()}`, { action: 'reserve' });

                const modified = await this.loyaltyPointRepository.reserve(orderID, userID, lp._id.toString(),  reservedPoints);
                if (modified !== 1) {
                    this.logger.error(`ERROR: Reserve redeem points: userID: ${userID}, points: ${reservedPoints}, loyaltyPointID: ${lp._id.toString()}`, { action: 'reserve' });
                    //TODO : send failure email to back office
                }
            }
            await this.lock.release(`loyaltypoint-${userID}`);
        } catch(e) {
            await this.lock.release(`loyaltypoint-${userID}`);
            throw e;
        }
    }

    async validateRedeemPoints(userID: string, pointsToRedeem: number): Promise<{ valid: boolean, availablePoints: number}> {
        if (!this.environment.loyaltyEnabled) return Promise.resolve({ valid: true, availablePoints: 0 });

        let availablePoints: number;

        try {
            await this.lock.acquire(`loyaltypoint-${userID}`);
            availablePoints = (await this.getLoyaltyPoints(userID)).availablePoints;
            await this.lock.release(`loyaltypoint-${userID}`);
        } catch(e) {
            await this.lock.release(`loyaltypoint-${userID}`);
            throw e;
        }

        return { valid: availablePoints >= pointsToRedeem, availablePoints };
    }

    async availablePoints(userID: string): Promise<{ points: number }> {
        if (!this.environment.loyaltyEnabled) return Promise.resolve({ points: 0});
        let availablePoints: number;
        
        try {
            await this.lock.acquire(`loyaltypoint-${userID}`);
            availablePoints = (await this.getLoyaltyPoints(userID)).availablePoints;
            await this.lock.release(`loyaltypoint-${userID}`);
        } catch(e) {
            await this.lock.release(`loyaltypoint-${userID}`);
            throw e;
        }

        return { points: availablePoints };
    }

    private async getLoyaltyPoints(userID: string): Promise<{ loyaltyPoints: Array<LoyaltyPoint>, availablePoints: number }> {
        let loyaltyPoints = await this.loyaltyPointRepository.getForUser(userID);
        const availablePoints = loyaltyPoints && loyaltyPoints.length > 0 ? loyaltyPoints.map((l: any) => l._doc.availablePoints - l._doc.reservedPoints).reduce((acc, val) => acc + val) : 0;
        loyaltyPoints = loyaltyPoints.map((l: any) => l._doc).sort((a, b) => new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime());

        return { loyaltyPoints, availablePoints };
    }
}
