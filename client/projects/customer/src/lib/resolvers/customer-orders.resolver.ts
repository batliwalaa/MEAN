import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DataStoreService, OrderService } from '@common/src/public-api';
import { OrderFilterService } from '../services/order-filter.service';

@Injectable({
    providedIn: 'root',
})
export class CustomerOrdersResolver  {
    constructor(
        private orderService: OrderService,
        private dataStoreService: DataStoreService,
        private orderFilterService: OrderFilterService
    ) {}

    // tslint:disable
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const orderFilter = await this.dataStoreService.get('order-filter') ?? 'last 30 days';
        const filter = this.orderFilterService.getFilter(orderFilter);
        
        return await this.orderService.search(1, filter.from, filter.to).toPromise();
    }
}
