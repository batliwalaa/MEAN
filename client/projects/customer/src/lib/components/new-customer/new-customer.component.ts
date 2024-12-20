import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    BaseComponent,
    CheckAllInputsValidDirective,
    DataStoreService,
    HttpStatusCode,
    IInputValue,
    ILookup,
    NavigationService,
    RouteKeys,
    VerificationType,
    WINDOW,
} from '@common/src/public-api';
import { BehaviorSubject, from } from 'rxjs';
import { delay, first, takeUntil } from 'rxjs/operators';
import { INewCustomer } from '../../models/INewCustomer';
import { CustomerService } from '../../services/customer.service';

@Component({
    selector: 'ui-new-customer',
    templateUrl: './new-customer.component.html',
    styleUrls: ['./new-customer.component.scss'],
})
export class NewCustomerComponent extends BaseComponent implements AfterViewInit {
    errors: Array<any> = [];

    @ViewChild(CheckAllInputsValidDirective) checkAllInputs: CheckAllInputsValidDirective;
    inputValidatorInitialiser: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isValid: boolean;
    isoNumbers: Array<ILookup> = [{ id: '+44', value: 'UK +44' }];
    metadata: any;
    ignoreMediaQueries: boolean;
    model: INewCustomer;

    constructor(
        private customerService: CustomerService,
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService,
        @Inject(WINDOW) window: any,
        router: Router,
        dataStoreService: DataStoreService
    ) {
        super(router, window, null, dataStoreService);
    }

    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata['NewCustomer'];
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

    public async onCreateAccountClick(): Promise<void> {
        await from([0]).pipe(delay(100), first()).toPromise();

        if (this.isValid) {
            this.errors = [];
            this.model.isoCode = '+44';
            try {
                await this.tokenService.xsrf();
                await this.customerService.createNewAccount(this.model);
                await this.dataStoreService.push('verify-otp', {
                    isoCode: this.model.isoCode,
                    mobile: this.model.mobile,
                    verificationType: VerificationType.NewAccountVerify,
                });
                this.navigationService.navigateForUrl(RouteKeys.VerifyOtp);
            } catch (e) {
                if (e.status === HttpStatusCode.BadRequest) {
                    this.errors = e.error;
                } else {
                    this.navigationService.navigateForUrl(RouteKeys.ErrorFatal);
                }
            }
        }
    }

    get hasErrors(): boolean {
        return this.errors.length > 0;
    }

    private reset(): void {
        this.resetModel();
    }

    private resetModel(): void {
        this.model = {
            firstName: '',
            lastName: '',
            email: '',
            isoCode: '+44',
            mobile: '',
            password: '',
            confirmPassword: '',
        };
    }
}
