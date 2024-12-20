import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NotificationMessageKeys } from '@common/src/lib/constants/notification.message.keys';
import {
    AuthService,
    BaseComponent,
    DataStoreService,
    HttpStatusCode,
    IInputValue,
    NavigationService,
    NotificationService,
    RouteKeys,
    VerificationService,
    VerificationType,
    WINDOW,
} from '@common/src/public-api';
import { ProfileChangeProperty } from 'projects/typings/custom';
import { from, timer } from 'rxjs';
import { delay, take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ui-otp-verification-component',
    templateUrl: './otp-verification.component.html',
    styleUrls: ['./otp-verification.component.scss'],
})
export class OtpVerificationComponent extends BaseComponent {
    otp: string;
    password: string;
    metadata: any;
    errors: Array<any> = [];
    isValid: boolean;
    ignoreMediaQueries: boolean;
    verifyOtpModel: any;
    verify: boolean;
    verified: boolean;
    verificationFailure: boolean;
    expired: boolean;
    timeInSeconds: number;
    type: ProfileChangeProperty = 'Mobile';

    private debug: boolean = false;

    constructor(
        private navigationService: NavigationService,
        private verificationService: VerificationService,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private notificationService: NotificationService,
        @Inject(WINDOW) window: any,
        router: Router,
        dataStoreService: DataStoreService
    ) {
        super(router, window, null, dataStoreService);
    }

    protected async init(): Promise<void> {
        this.setState('verify');
        this.metadata = this.activatedRoute.snapshot.data.metadata['OtpVerification'];
        this.verifyOtpModel = this.activatedRoute.snapshot.data.verifyOtpModel;
        this.type = this.verifyOtpModel.email ? 'Email' : this.type;
        this.otp = '';
        this.password = '';
    }

    public async onResendClick(): Promise<void> {
        if (this.type === 'Mobile'){
            await this.verificationService.resendMobileOtp(
                this.verifyOtpModel.verificationType,
                this.verifyOtpModel.isoCode,
                this.verifyOtpModel.mobile
            );
        } else {
            await this.verificationService.resendEmailOtp(
                this.verifyOtpModel.verificationType,
                this.verifyOtpModel.currentEmailID,
                this.verifyOtpModel.email                
            );
        }
        this.notificationService.showMessage(NotificationMessageKeys.OtpResend);
        this.setState('verify');
    }
    public async onVerifyClick(): Promise<void> {
        try {
            await this.verifyOtp()            
            this.setState('verified');
            await this.dataStoreService.push('verify-otp', null);
            
            if (this.verifyOtpModel.verificationType !== VerificationType.ProfileChange) {
                await this.showVerified();
            } else {
                await this.authService.logout();
            }
        } catch (e) {
            this.otp = '';
            if (e.status === HttpStatusCode.BadRequest && e.error && e.error.state === 'Expired') {
                this.setState('expired');
            } else {
                this.setState('failure');
                this.dataStoreService.push('verify-otp', null);
            }
        }
    }

    public onValueChange(inputValue: IInputValue): void {
        if (inputValue.name === 'otp') {
            this.otp = inputValue.value;
            this.isValid = this.otp && this.otp.trim().length === 8;
        }

        if (inputValue.name === 'password') {
            this.password = inputValue.value;
        }
    }

    public onKeyUp($event: any): void {
        this.isValid = $event.target.value.length === 8;
    }

    public async onPasswordSubmitClick(): Promise<void> {
        const username = this.type === 'Email' ? this.verifyOtpModel.email : this.verifyOtpModel.mobile;
        await this.authService.login(this.type, this.verifyOtpModel.isoCode, username, this.password);
        await this.navigationService.back();
    }

    get hasErrors(): boolean {
        return this.errors.length > 0;
    }

    get isProfileChange(): boolean {
        return this.verifyOtpModel.verificationType === VerificationType.ProfileChange;
    }

    private setState(state: string): void {
        this.verify = this.debug || state === 'verify' || state === 'expired';
        this.verificationFailure = this.debug || state === 'failure';
        this.verified = this.debug || state === 'verified';
        this.expired = this.debug || state === 'expired';
    }

    private async verifyOtp(): Promise<void> {
        if (this.type === 'Mobile') {
            await this.verificationService.verifyMobileOtp(
                this.verifyOtpModel.verificationType,
                this.verifyOtpModel.isoCode,
                this.verifyOtpModel.mobile,
                this.otp
            );
        } else {
            await this.verificationService.verifyEmailOtp(
                this.verifyOtpModel.verificationType,
                this.verifyOtpModel.email,
                this.otp
            );
        }
    }

    private async showVerified(): Promise<void> {
        this.timeInSeconds = this.metadata.autoRedirect.time;
        timer(1000, 1000)
            .pipe(take(2), takeUntil(this.$destroy))
            .subscribe((_) => --this.timeInSeconds);
        from([0])
            .pipe(delay(3000), takeUntil(this.$destroy))
            .subscribe(async (_) => {
                const redirect =
                    this.verifyOtpModel.verificationType === VerificationType.NewAccountVerify
                        ? RouteKeys.Signin : RouteKeys.PasswordReset;
                this.otp = '';
                await this.navigationService.navigateForUrl(redirect);
            });
        
        if (this.verifyOtpModel.verificationType === VerificationType.ResetPassword) {
            await this.dataStoreService.push('pr-user', {
                mode: 'Mobile',
                isoCode: this.verifyOtpModel.isoCode,
                userName: this.verifyOtpModel.mobile,
            });
        }
    }
}
