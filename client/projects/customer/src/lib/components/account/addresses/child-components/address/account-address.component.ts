import { Component, Input, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseAccountComponent } from '../../../base-account.component';

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
import { takeUntil } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';


@Component({
    selector: 'ui-account-address',
    templateUrl: './account-address.component.html',
    styleUrls: ['./account-address.component.scss'],
})
export class AccountAddressComponent extends BaseComponent implements AfterViewInit {
    @ViewChild(CheckAllInputsValidDirective) checkAllInputs: CheckAllInputsValidDirective;
    @Input() metadata: any;   
    @Input() states: Array<ILookup>;   

    inputValidatorInitialiser: BehaviorSubject<boolean> = new BehaviorSubject(false);
    address: Address = {};
    _id: string;
    isValid: boolean;
  
    failure: boolean;
    errors: Array<string> = [];


    constructor(
        private addressService: AddressService,
        private activatedRoute: ActivatedRoute,
        @Inject(WINDOW) window: Window,
        router: Router,
        dataStoreService: DataStoreService
    ) {
        super(router, window, null, dataStoreService);
    }

    protected async init(): Promise<void> {
        const id = this.activatedRoute.snapshot.params['id'];
        this.metadata = !!id 
            ? this.activatedRoute.snapshot.data.metadata.AccountAddressEdit
            : this.activatedRoute.snapshot.data.metadata.AccountAddressAdd;
        this.states = this.activatedRoute.snapshot.data.states;
        
        if (id) {        
            this.address =  await this.addressService.getById(id);
            this.inputValidatorInitialiser.next(true);
        }
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
           
            this.router.navigate([RouteKeys.AccountAddresses]);
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
    
}

