import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent, DataStoreService, NavigationService, RouteKeys, VerificationService, VerificationType, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-forgot-password-component',
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss'],
})
export class ForgotPasswordComponent extends BaseComponent {
    metadata: any;
    recover: boolean;
    emailSent: boolean;
    userModel: { isoCode: string; mobile: string; email: string };
    errors: Array<any> = [];

    private debug: boolean = false;

    constructor(
        private verificationService: VerificationService,
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService,
        @Inject(WINDOW) window: any,
        router: Router,
        dataStoreService: DataStoreService
    ) {
        super(router, window, null, dataStoreService);
    }

    protected async init(): Promise<void> {
        this.setState('recover');
        this.metadata = this.activatedRoute.snapshot.data.metadata['ForgotPassword'];
        this.userModel = this.activatedRoute.snapshot.data.recovery;
        return Promise.resolve();
    }

    public async onSendOtpClick(): Promise<void> {
        await this.tokenService.xsrf();
        await this.verificationService.sendOtp(
            VerificationType.ResetPassword,
            this.userModel.isoCode,
            this.userModel.mobile
        );
        await this.dataStoreService.push('fp-user', null);
        await this.dataStoreService.push('verify-otp', {
            isoCode: this.userModel.isoCode,
            mobile: this.userModel.mobile,
            verificationType: VerificationType.ResetPassword,
        });
        this.navigationService.navigateForUrl(RouteKeys.VerifyOtp);
    }

    public async onSendEmailClick(): Promise<void> {
        await this.tokenService.xsrf();
        await this.verificationService.sendEmail(VerificationType.ResetPassword, this.userModel.email);
        await this.dataStoreService.push('fp-user', null);

        this.setState('emailsent');
    }

    get hasErrors(): boolean {
        return this.debug || this.errors.length > 0;
    }

    private setState(state: string): void {
        this.recover = this.debug || state === 'recover';
        this.emailSent = this.debug || state === 'emailsent';
    }
}
