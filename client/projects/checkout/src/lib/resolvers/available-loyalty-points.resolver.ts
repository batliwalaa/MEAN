import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ConfigService, DeliveryOptionsService } from '@common/src/public-api';
import { LoyaltyPointService } from '../services/loyalty-point.service';

@Injectable({
    providedIn: 'root',
})
export class AvailableLoyaltyPointsResolver  {
    constructor(
        private loyaltyPointService: LoyaltyPointService,
        private configService: ConfigService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        if (this.configService.getConfiguration().loyaltyPoints) {
            return await this.loyaltyPointService.availablePoints();
        }

        return Promise.resolve();
    }
}
