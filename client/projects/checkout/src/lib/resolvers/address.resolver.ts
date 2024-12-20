import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Address, RouteKeys, AddressService } from '@common/src/public-api';
import { CheckoutStateService } from '../services/checkout-state.service';
import { EMPTY, from, Observable, of } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class AddressResolver  {
    constructor(
        private checkoutStateService: CheckoutStateService,
        private addressService: AddressService,
        private router: Router
    ) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<Address>> {
        return from(this.addressService.getForUser()).pipe(
            switchMap((addresses) => {
                if (addresses && addresses.length > 0) {
                    for (const address of addresses) {
                        this.checkoutStateService.addAddress(address);
                    }
                    return of(addresses);
                } else {
                    this.router.navigate([RouteKeys.CheckoutAddressAdd]);
                    return EMPTY;
                }
            }),
            first()
        );
    }
}
