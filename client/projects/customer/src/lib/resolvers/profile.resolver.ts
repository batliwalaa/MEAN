import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CustomerService } from '../services/customer.service';

@Injectable({
    providedIn: 'root',
})
export class ProfileResolver  {
    constructor (
        private customerService: CustomerService
    ) {}

    // tslint:disable
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return await this.customerService.getAccountInfo();
    }
}
