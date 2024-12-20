import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { ProductReviewService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class OrderReviewResolver  {
    constructor(
        private productReviewService: ProductReviewService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        const orderid = route.params['orderid'];

        return await this.productReviewService.getOrderReview(orderid).toPromise();
    }
}
