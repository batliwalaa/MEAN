import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { ProductReviewService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class OrderProductReviewResolver  {
    constructor(
        private productReviewService: ProductReviewService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        const orderid = route.params['orderid'];
        const productid = route.params['productid'];

        return await this.productReviewService.getOrderProductReview(orderid, productid).toPromise();
    }
}
