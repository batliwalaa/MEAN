import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { CustomerService } from '../services/customer.service';
import { DataStoreService, TokenService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class ForgotPasswordResolver  {
    constructor(
        private dataStoreService: DataStoreService,
        private userService: CustomerService,
        private router: Router,
        private tokenService: TokenService
    ) {}

    // tslint:disable
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const fp = await this.dataStoreService.get('fp-user');
        if (fp) {
            await this.tokenService.xsrf();
            return await this.userService.getPasswordRecoveryInfo(fp.mode, fp.isoCode, fp.userName);
        } else {
            this.router.navigateByUrl('/home');
        }
    }
}
