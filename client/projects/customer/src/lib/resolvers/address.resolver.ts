import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Address, AddressService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class AddressResolver  {
    constructor(       
        private addressService: AddressService
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Array<Address>> {
        return this.addressService.getForUser();        
    }
}
