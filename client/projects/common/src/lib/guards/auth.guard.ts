import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { RouteKeys } from '../constants/route.keys';
import { AuthService } from '../services/auth.service';
import { DataStoreService } from '../services/data-store.service';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard  {
    constructor(private authService: AuthService, private router: Router, private dataStoreService: DataStoreService) {}

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
        if (this.authService.user && this.authService.user.authenticated) {
            return true;
        } else {
            this.dataStoreService.push('redirect-url', state.url);
            this.router.navigate([RouteKeys.Signin]);
        }
    }
}
