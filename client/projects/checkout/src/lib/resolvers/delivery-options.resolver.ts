import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DeliveryOptionsService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class DeliveryOptionsResolver  {
    constructor(private deliveryOptionsService: DeliveryOptionsService) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return await this.deliveryOptionsService.deliveryOptions();
    }
}
