import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { ConfigService, ProductReviewService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class ProductReviewsResolver  {
    constructor(
        private productReviewService: ProductReviewService,
        private configService: ConfigService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        const id = route.params['id'];
        return await this.productReviewService.getReviews(id, 1, this.configService.getConfiguration().reviewLimit).toPromise();
    }
}
