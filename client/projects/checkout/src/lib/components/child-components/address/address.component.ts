import { Component, Input, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

import {
    BaseComponent,
    ILookup,
    Address,
    IInputValue,
    CheckAllInputsValidDirective,
    DataStoreService,
    HttpStatusCode,
    RouteKeys,
    WINDOW,
    AddressService
} from '@common/src/public-api';
import { CheckoutStateService } from '../../../services/checkout-state.service';

@Component({
    selector: 'ui-address',
    templateUrl: './address.component.html',
    styleUrls: ['./address.component.scss'],
})
export class AddressComponent extends BaseComponent implements AfterViewInit {
    @ViewChild(CheckAllInputsValidDirective) checkAllInputs: CheckAllInputsValidDirective;
    @Input() metadata: any;
    @Input() addresses: Array<Address>;
    @Input() states: Array<ILookup>;

    inputValidatorInitialiser: BehaviorSubject<boolean> = new BehaviorSubject(false);
    address: Address = {};
    isValid: boolean;
    showBack: boolean = false;
    backLink: string = '../../address/select';
    acceptance: any;
    failure: boolean;
    errors: Array<any> = [];

    constructor(
        private checkoutStateService: CheckoutStateService,
        private addressService: AddressService,
        private activatedRoute: ActivatedRoute,
        @Inject(WINDOW) window: Window,
        router: Router,
        dataStoreService: DataStoreService
    ) {
        super(router, window, null, dataStoreService);
    }

    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata['Checkout'].address;
        this.acceptance = this.activatedRoute.snapshot.data.metadata['Checkout'].acceptance;
        this.states = this.activatedRoute.snapshot.data.states;
        this.showBack = this.checkoutStateService.hasAddresses;

        const id = this.activatedRoute.snapshot.params['id'];
        if (id) {
            this.address = this.checkoutStateService.addresses.find((a) => a._id === id);
            this.inputValidatorInitialiser.next(true);
            this.backLink = `../${this.backLink}`;
        }

        return Promise.resolve();
    }

    async ngAfterViewInit(): Promise<void> {
        this.checkAllInputs.validationStateChange.pipe(takeUntil(this.$destroy)).subscribe((state) => {
            this.isValid = state;
        });

        return Promise.resolve();
    }

    async onSubmitClick(): Promise<void> {
        try {
            this.address._id = (await this.addressService.save(this.address))._id;
            this.checkoutStateService.setSelectedAddressIndex(this.checkoutStateService.addAddress(this.address));
            this.router.navigate([RouteKeys.CheckoutDeliverySlots]);
        } catch (e) {
            if (e.status === HttpStatusCode.BadRequest) {
                this.errors = e.error;
            } else if (e.status === HttpStatusCode.Unauthorized) {
                await this.dataStoreService.push('redirect-url', '/checkout/address/add');
                this.router.navigateByUrl('/signin');
            } else {
                this.router.navigateByUrl(RouteKeys.ErrorFatal);
            }
        }
    }

    onAddressChange(value: Address): void {
        this.address = Object.assign(this.address, value);
    }

    onValueChange(inputValue: IInputValue): void {
        this.address[inputValue.name] = inputValue.value;
    }

    get hasErrors(): boolean {
        return this.errors.length > 0;
    }
}
