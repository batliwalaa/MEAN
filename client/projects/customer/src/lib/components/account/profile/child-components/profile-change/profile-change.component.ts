import { AfterViewInit, Component, EventEmitter, Inject, Input, Output, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { delay, first, takeUntil } from "rxjs/operators";

import { 
    BaseComponent,
    CheckAllInputsValidDirective,
    ConfigService,
    DataStoreService,
    HttpStatusCode,
    IConfiguration,
    IInputValue,
    ILookup,
    NavigationService,
    NotificationService,
    RouteKeys,
    TextboxComponent,
    VerificationService,
    VerificationType,
    WINDOW
} from "@common/src/public-api";
import { ProfileChange } from "../../models/profile-change.model";
import { CustomerService } from "@customer/src/lib/services/customer.service";
import { ProfileChangeProperty } from "../../../../../../../../typings/custom";
import { BehaviorSubject, from } from "rxjs";
import { NotificationMessageKeys } from "@common/src/lib/constants/notification.message.keys";


@Component({
    selector: 'ui-account-profile-change',
    templateUrl: './profile-change.component.html',
    styleUrls: ['./profile-change.component.scss']
})
export class ProfileChangeComponent extends BaseComponent implements AfterViewInit {
    @Output() cancel = new EventEmitter<void>();
    @Output() resendOtp = new EventEmitter<ProfileChangeProperty>();

    @Input() type: ProfileChangeProperty;
    @Input() profile: any;
    @Input() metadata: any;
    
    @ViewChild(CheckAllInputsValidDirective) checkAllInputs: CheckAllInputsValidDirective;
    @ViewChild('emailControl') emailControl: TextboxComponent;
    @ViewChild('mobileControl') mobileControl: TextboxComponent;

    inputValidatorInitialiser: BehaviorSubject<boolean> = new BehaviorSubject(false);
    isValid: boolean;
    ignoreMediaQueries: boolean;
    model: ProfileChange;
    isoNumbers: Array<ILookup>;
    errors: Array<any> = [];
    verificationFailure: boolean;
    expired: boolean;
    
    private readonly debug: boolean = false;
    private readonly configuration: IConfiguration;

    constructor(
        @Inject(WINDOW) window: any,
        router: Router,
        dataStoreService: DataStoreService,
        private verificationService: VerificationService,
        private customerService: CustomerService,
        private navigationService: NavigationService,
        private notificationService: NotificationService,
        configService: ConfigService
    ) {
        super(router, window, null, dataStoreService);

        this.configuration = configService.getConfiguration();
        this.model = { isoCode: this.configuration.countryCode };
        this.isoNumbers =  [{ id: this.configuration.countryCode, value: `${this.configuration.country} ${this.configuration.countryCode}` }];
    }

    get hasErrors(): boolean {
        return this.errors.length > 0;
    }

    async ngAfterViewInit(): Promise<void> {
        this.checkAllInputs.validationStateChange.pipe(takeUntil(this.$destroy)).subscribe((state: any) => {
            this.isValid = state;
        });

        this.model.type = this.type;
        this.inputValidatorInitialiser.next(true);

        return Promise.resolve();
    }

    public async onValueChange(input: IInputValue): Promise<void> {
        this.model[input.name] = input.value;
        await Promise.resolve();
    }

    public async onCancelClick(): Promise<void> {
        this.errors = [];
        this.model = { isoCode: this.configuration.countryCode };
        this.cancel.emit();
        await Promise.resolve();
    }

    public async onResendClick(): Promise<void> {
        this.resendOtp.emit(this.type);
        await Promise.resolve();
    }

    public async onSubmitClick(): Promise<void> {
        if (this.isValid && this.validateOldWithNewValues()) {
            try {
                await this.verificationService.verifyProfileChangeOtp(this.model.otp, this.model.type);
                await this.changeProfile();
            } catch(e){
                if (e.status === HttpStatusCode.BadRequest && e.error && e.error.state === 'Expired') {
                    this.setState('expired');
                } else {
                    this.setState('failure');
                }
            }
        }
    }
    
    private setState(state: string): void {
        this.verificationFailure = this.debug || state === 'failure';
        this.expired = this.debug || state === 'expired';
    }

    private validateOldWithNewValues(): boolean {
        let valid = true;
        if (this.model.type === 'Email') {            
            valid = this.profile.emailId !== this.model.email;

            if (!valid) {
                this.emailControl.focus();
                this.errors.push({ key: 'Email', error: 'current and new email id cannot be same. '})
            }
        } else {
            valid = this.profile.mobile !== this.model.mobile;

            if (!valid) {
                this.mobileControl.focus();
                this.errors.push({ key: 'Mobile', error: 'current and new mobile cannot be same. '})
            }
        }

        if(!valid) {
            from([0]).pipe(delay(30000), first()).subscribe(_ => this.errors = []);
        }

        return valid;
    }

    private async changeProfile(): Promise<void> {
        try {
            await this.customerService.tempProfileChange(this.type, (this.type === 'Email' ? this.model.email : this.model.mobile));
            await this.dataStoreService.push('verify-otp', {
                isoCode: (this.type === 'Email' ? null : this.model.isoCode),
                mobile: (this.type === 'Email' ? null : this.model.mobile),
                email: (this.type === 'Email' ? this.model.email : null),
                currentEmailID: (this.type === 'Email' ? this.profile.emailId : null),
                verificationType: VerificationType.ProfileChange,
            });
            await this.onCancelClick();
            
            this.navigationService.navigateForUrl(RouteKeys.VerifyOtp, this.currentPage, true);

        } catch (e) {
            if (e.status === HttpStatusCode.BadRequest) {
                // TODO: show error message
            } else {
                this.notificationService.showMessage(NotificationMessageKeys.GenericError);
            }
        }
    }
}