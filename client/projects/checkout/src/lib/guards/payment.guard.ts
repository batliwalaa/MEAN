import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

import { DataStoreService, RouteKeys } from '@common/src/public-api';
import { PaymentCompleteResponse } from '../types/payment-complete-response';

@Injectable({
    providedIn: 'root',
})
export class PaymentGuard  {
    constructor(
        private router: Router,
        private dataStoreService: DataStoreService
    ) {}

    async canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        return await this.canActivate(childRoute, state);
    }

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const paymentResponse = await this.dataStoreService.get('payment-result') as PaymentCompleteResponse;
        if (paymentResponse) {
            return true;
        } else {
            this.router.navigate([RouteKeys.Home]);
        }
    }
}
