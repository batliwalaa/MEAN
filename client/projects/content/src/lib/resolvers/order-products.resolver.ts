import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { OrderService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class OrderProductsResolver  {
    constructor(
        private orderService: OrderService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        const orderid = route.params['orderid'];

        return await this.orderService.getOrderProducts(orderid).toPromise();
    }
}
