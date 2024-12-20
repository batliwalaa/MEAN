import { Component, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { from } from 'rxjs';
import { delay, first, takeUntil } from 'rxjs/operators';

import {
    BaseComponent,
    ConfigService,
    DataStoreService,
    IConfiguration,
    IInputValue,
    NavigationService,
    RouteKeys,
    TextboxComponent,
    VerificationService,
    VerificationState,
    VerificationType,
    WINDOW,
} from '@common/src/public-api';
import { ILogin } from '@login/src/lib/models/ILogin';
import { LoginService } from '@login/src/lib/services/login.service';

@Component({
    selector: 'ui-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements AfterViewInit {
    private errorMessage: string;
    private returnUrl: string;
    private readonly configuration: IConfiguration;

    model: ILogin;
    metadata: any;
    acceptPassword: boolean;
    isContinueDisabled = true;
    isStepOne = true;
    ignoreMediaQueries: boolean;
    showPasswordText: boolean;
    passwordAsClearText: string;
    notVerified: boolean = false;
    verificationSent: boolean;

    @ViewChild('passwordControl') passwordControl: TextboxComponent;
    @ViewChild('userNameControl') userNameControl: TextboxComponent;

    constructor(
        private loginService: LoginService,
        private verificationService: VerificationService,
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService,
        @Inject(WINDOW) window: any,
        router: Router,
        dataStoreService: DataStoreService,
        configService: ConfigService
    ) {
        super(router, window, null, dataStoreService);
        this.configuration = configService.getConfiguration();
        this.model = {
            userName: null,
            password: null,
            mode: '',
            isoCode: this.configuration.countryCode,
        };
        this.ignoreMediaQueries = true;
    }

    protected async init(): Promise<void> {
        this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl']  || (await this.dataStoreService.get('redirect-url')) || '/home';
        await this.dataStoreService.push('redirect-url', null);
        this.metadata = this.activatedRoute.snapshot.data.metadata['SignIn'];
        this.reset();
        return Promise.resolve();
    }

    async ngAfterViewInit(): Promise<void> {
        this.setFocus('username');

        return Promise.resolve();
    }

    public onValueChange(inputValue: IInputValue): void {
        switch (inputValue.name) {
            case 'emailOrMobile':
                this.model.userName = inputValue.value;
                this.model.mode = this.getLoginMode(inputValue.value);
                break;
            case 'password':
                this.model.password = inputValue.value;
                break;
        }
    }

    public onForgotPasswordClick(): void {
        this.dataStoreService
            .push('fp-user', { isoCode: this.model.isoCode, mode: this.model.mode, userName: this.model.userName })
            .then((_) => this.navigationService.navigateForUrl(RouteKeys.ForgotPassword));
    }

    public async onContinueButtonClick(): Promise<void> {
        await this.buttonClick();
    }

    public async onSignInButtonClick(): Promise<void> {
        await this.buttonClick();
    }

    public async onResendOtpClick(): Promise<void> {
        try {
            await this.verificationService.resendMobileOtp(
                VerificationType.NewAccountVerify,
                this.model.isoCode,
                this.model.userName
            );
            await this.dataStoreService.push('verify-otp', {
                isoCode: this.model.isoCode,
                mobile: this.model.userName,
                verificationType: VerificationType.NewAccountVerify,
            });
            this.router.navigateByUrl('/verifyotp');
        } catch (e) {
            this.errorMessage = this.getErrorMessage('resendOtp');
            from([0])
                .pipe(delay(5000), takeUntil(this.$destroy))
                .subscribe((_) => (this.errorMessage = ''));
        }
    }

    public async onResendEmailClick(): Promise<void> {
        try {
            await this.verificationService.resendEmail(VerificationType.NewAccountVerify, this.model.userName);
            this.verificationSent = true;
            this.notVerified = false;
            from([0])
                .pipe(delay(10000), takeUntil(this.$destroy))
                .subscribe((_) => {
                    this.verificationSent = false;
                    this.errorMessage = null;
                });
        } catch (e) {
            this.errorMessage = this.getErrorMessage('resendEmail');
            from([0])
                .pipe(delay(5000), takeUntil(this.$destroy))
                .subscribe((_) => (this.errorMessage = ''));
        }
    }

    public getErrorMessageIfAny(): string {
        return this.errorMessage;
    }

    public setShowPasswordText(show: boolean): void {
        this.showPasswordText = show;
    }

    public onKeyup($event: KeyboardEvent): void {
        this.passwordAsClearText = ($event.target as HTMLInputElement).value;
    }

    public onChangeClick(): void {
        this.reset();
        this.setFocus('username');
    }

    get diagnostic() {
        return JSON.stringify(this.model);
    }

    get hasErrors(): boolean {
        return !(this.errorMessage === null || this.errorMessage === undefined || this.errorMessage.length === 0);
    }

    private reset(): void {
        this.resetModel();
        this.isStepOne = true;
        this.acceptPassword = false;
        this.showPasswordText = false;
        this.passwordAsClearText = '';
        this.notVerified = false;
        this.verificationSent = false;
    }

    private resetModel(): void {
        this.model = { userName: '', password: '', mode: '', isoCode: this.configuration.countryCode };
    }

    private setFocus(controlName: string): void {
        from([0]).pipe(delay(0), first()).subscribe(x => {
            if (controlName.toLowerCase() === 'username') {
                this.userNameControl.focus();
            } else {
                this.passwordControl.focus();
            }            
        });
    }

    private async buttonClick(): Promise<void> {
        this.errorMessage = null;

        try {
            if (this.isStepOne) {
                const verificationState = await this.loginService.validateUsername(
                    this.model.mode,
                    this.model.userName,
                    this.model.isoCode
                );
                if (verificationState && verificationState.state === VerificationState.NotVerified) {
                    this.notVerified = true;
                } else {
                    this.isStepOne = false;
                    this.setFocus('password');
                }
            } else {
                await this.loginService.signin(
                    this.model.mode,
                    this.model.userName,
                    this.model.isoCode,
                    this.model.password
                );
                const redirect = this.returnUrl;
                this.router.navigateByUrl(redirect);
            }
        } catch (e) {
            if (e.status === 400) {
                this.errorMessage = this.getErrorMessage(`invalid${this.model.mode}`);
            } else {
                this.errorMessage = this.getErrorMessage(
                    this.isStepOne ? `validateUsername${this.model.mode}` : 'password'
                );
            }
        }
    }

    private getErrorMessage(key: string): string {
        const msg = this.metadata.errorMessages.find((m) => m.key === key);

        if (msg) {
            return msg.text;
        }

        return 'Unknown Error';
    }

    private getLoginMode(value: string): 'Mobile' | 'Email' {
        const pattern = "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|&#34;(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*&#34;)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";
        const regex = new RegExp(pattern);
        
        return regex.test(value) ? 'Email' : 'Mobile';
    }
}
