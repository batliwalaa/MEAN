import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { OrderService } from '@common/src/public-api';


@Injectable({
    providedIn: 'root',
})
export class CustomerOrderDetailResolver  {
    constructor(
        private orderService: OrderService
    ) {}

    // tslint:disable
    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        const id = route.params['id'] || route.params['orderid'];

        return await this.orderService.get(id).toPromise();
    }
}
