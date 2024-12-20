import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { CookieService, DataStoreService, NavigationService, RouteKeys } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard  {
    constructor(
        private cookieService: CookieService,
        private dataStoreService: DataStoreService,
        private navigationService: NavigationService
    ) {}

    canActivateChild(
        childRoute: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.canActivate(childRoute, state);
    }

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        if (this.cookieService.exists('pa')) {
            return true;
        } else {
            const type = route.params['type'];
            this.dataStoreService.push('redirect-url', state.url);
            this.navigationService.navigateForUrl(`${[RouteKeys.AccountProfileAccess]}/${type}`);
        }
    }
}
