import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { delay, take, takeUntil } from 'rxjs/operators';
import { CustomerService } from '../../services/customer.service';
import {
    BaseComponent,
    CheckAllInputsValidDirective,
    IInputValue,
    RouteKeys,
    WINDOW,
} from '@common/src/public-api';
import { ChangePasswordModel, ChangePasswordState } from '../../models';
import { BehaviorSubject, from, timer } from 'rxjs';

@Component({
    selector: 'ui-password-reset-component',
    templateUrl: './password-reset.component.html',
    styleUrls: ['./password-reset.component.scss'],
})
export class PasswordResetComponent extends BaseComponent implements AfterViewInit {
    errors: Array<any> = [];
    metadata: any;
    ignoreMediaQueries: boolean;
    model: ChangePasswordModel;
    @ViewChild(CheckAllInputsValidDirective) checkAllInputs: CheckAllInputsValidDirective;
    inputValidatorInitialiser: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isValid: boolean;
    showChangePassword: boolean = true;
    success: boolean;
    failure: boolean;
    timeInSeconds: number;

    private debug: boolean = false;

    constructor(
        private customerService: CustomerService,
        private activatedRoute: ActivatedRoute,
        @Inject(WINDOW) window: any,
        router: Router
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata['PasswordReset'];
        this.reset();

        return Promise.resolve();
    }

    async ngAfterViewInit(): Promise<void> {
        this.checkAllInputs.validationStateChange.pipe(takeUntil(this.$destroy)).subscribe((state) => {
            this.isValid = state;
        });
        this.inputValidatorInitialiser.next(true);

        return Promise.resolve();
    }

    public onValueChange(inputValue: IInputValue): void {
        this.model[inputValue.name] = inputValue.value;
    }

    public async onChangePasswordClick(): Promise<void> {
        if (this.isValid) {
            this.errors = [];

            try {
                await this.tokenService.xsrf();
                const changeState: { state: ChangePasswordState } = await this.customerService.changePassword(
                    this.model
                );

                if (changeState.state === ChangePasswordState.Success) {
                    timer(1000, 1000)
                        .pipe(take(2), takeUntil(this.$destroy))
                        .subscribe((_) => --this.timeInSeconds);
                    from([0])
                        .pipe(delay(3000), takeUntil(this.$destroy))
                        .subscribe(async (_) => {
                            const redirect = '/signin';
                            this.router.navigateByUrl(redirect);
                        });
                    this.setState('success');
                } else if (changeState.state === ChangePasswordState.PasswordInPreviousSet) {
                    this.errors = this.metadata.errorMessages.filter((e) => e.state === changeState.state);
                } else {
                    this.setState('failure');
                }
            } catch (e) {
                if (e.status === 400) {
                    this.errors = e.error;
                } else {
                    this.router.navigateByUrl(RouteKeys.ErrorFatal);
                }
            }
        }
    }

    get hasErrors(): boolean {
        return this.debug || this.errors.length > 0;
    }

    private reset(): void {
        this.timeInSeconds =
            this.metadata && this.metadata.changePassword && this.metadata.changePassword.success.autoRedirect.time;
        this.setState('show');
        this.resetModel();
    }

    private resetModel(): void {
        this.model = { mode: '', isoCode: '', userName: '', password: '', confirmPassword: '' };
    }

    private setState(state: string): void {
        this.success = this.debug || state === 'success';
        this.failure = this.debug || state === 'failure';
        this.showChangePassword = this.debug || state === 'show';
    }
}
