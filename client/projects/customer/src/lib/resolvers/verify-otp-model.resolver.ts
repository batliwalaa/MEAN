import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DataStoreService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class VerifyOtpModelResolver  {
    constructor(private dataStoreService: DataStoreService, private router: Router) {}

    // tslint:disable
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const verifyOtp = await this.dataStoreService.get('verify-otp');
        if (verifyOtp) {
            return verifyOtp;
        } else {
            this.router.navigateByUrl('/home');
        }
    }
}
