import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { OrderService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class OrderProductResolver  {
    constructor(
        private orderService: OrderService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        const orderid = route.params['orderid'];
        const productid = route.params['productid'];

        return await this.orderService.getProductForOrder(orderid, productid).toPromise();
    }
}
