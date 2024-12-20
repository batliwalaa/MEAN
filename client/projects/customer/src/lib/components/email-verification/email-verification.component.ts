import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BaseComponent,
    NavigationService,
    RouteKeys,
    VerificationService,
    VerificationState,
    VerificationType,
    WINDOW,
} from '@common/src/public-api';
import { from, timer } from 'rxjs';
import { delay, take, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ui-email-verification-component',
    templateUrl: './email-verification.component.html',
    styleUrls: ['./email-verification.component.scss'],
})
export class EmailVerificationComponent extends BaseComponent {
    metadata: any;
    verify: boolean;
    verified: boolean;
    verificationFailure: boolean;
    expired: boolean;
    resent: boolean;
    timeInSeconds: number;
    result: { state: VerificationState; type: VerificationType; email: string };
    private debug: boolean = false;

    constructor(
        @Inject(WINDOW) window: any,
        router: Router,
        private verificationService: VerificationService,
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {
        this.setState('verify');
        this.metadata = this.activatedRoute.snapshot.data.metadata['EmailVerification'];
        this.timeInSeconds = this.metadata.autoRedirect.time;

        const key = this.activatedRoute.snapshot.params['hash'];

        if (key) {
            try {
                await this.tokenService.xsrf();
                this.result = await this.verificationService.verifyEmail(key);
                if (this.result.state === VerificationState.Verified) {
                    timer(1000, 1000)
                        .pipe(take(2), takeUntil(this.$destroy))
                        .subscribe((_) => --this.timeInSeconds);
                    from([0])
                        .pipe(delay(3000), takeUntil(this.$destroy))
                        .subscribe(async (_) => {
                            const redirect =
                                this.result.type === VerificationType.NewAccountVerify ? RouteKeys.Signin : RouteKeys.PasswordReset;
                            await this.navigationService.navigateForUrl(redirect);
                        });
                    this.setState('verified');
                } else if (this.result.state === VerificationState.Expired) {
                    this.setState('expired');
                } else {
                    this.setState('failure');
                }
            } catch (e) {
                this.setState('failure');
            }
        } else {
            this.setState('failure');
        }
    }

    public async onResendClick(): Promise<void> {
        await this.tokenService.xsrf();
        await this.verificationService.resendEmail(this.result.type, this.result.email);
        this.setState('resent');
    }

    private setState(state: string): void {
        this.verify = this.debug || state === 'verify';
        this.verificationFailure = this.debug || state === 'failure';
        this.verified = this.debug || state === 'verified';
        this.expired = this.debug || state === 'expired';
        this.resent = this.debug || state === 'resent';
    }
}
