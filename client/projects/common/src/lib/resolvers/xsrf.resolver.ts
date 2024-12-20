import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { EMPTY } from 'rxjs';
import { TokenService } from '../services/token.service';

@Injectable({
    providedIn: 'root',
})
export class XsrfResolver  {
    constructor(private tokenService: TokenService) {}

    // tslint:disable
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        await this.tokenService.xsrf();
        console.info('XSRF Resolver');
        return EMPTY;
    }
}
