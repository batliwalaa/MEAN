import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Address, BaseComponent, RouteKeys, WINDOW, AddressService } from '@common/src/public-api';
import { CheckoutStateService } from '../../../services/checkout-state.service';

@Component({
    selector: 'ui-address-select',
    templateUrl: './address-select.component.html',
    styleUrls: ['./address-select.component.scss'],
})
export class AddressSelectComponent extends BaseComponent {
    addresses: Array<Address>;
    metadata: any;
    acceptance: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private checkoutStateService: CheckoutStateService,        
        private addressService: AddressService,
        router: Router,
        @Inject(WINDOW) window: Window
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {
        this.addresses = this.checkoutStateService.addresses;
        this.metadata = this.activatedRoute.snapshot.data.metadata['Checkout'].address;
        this.acceptance = this.activatedRoute.snapshot.data.metadata['Checkout'].acceptance;

        return Promise.resolve();
    }

    isSelectedOrDefaultAddress(id: string): boolean {
        const selectedAddress = this.checkoutStateService.selectedAddress;
        if (selectedAddress) {
            return selectedAddress._id === id;
        }

        return this.addresses.findIndex((a) => a.isDefaultAddress === true && id === a._id) !== -1;
    }

    onDeliverAddressClick(id: string): void {
        this.checkoutStateService.setSelectedAddressIndex(this.addresses.findIndex((a) => a._id === id));
        this.router.navigate([RouteKeys.CheckoutDeliverySlots]);
    }

    getAddress(address: Address): any {
        return { address };
    }

    onValueChange(id: string): void {
        this.checkoutStateService.setSelectedAddressIndex(this.addresses.findIndex((a) => a._id === id));
    }

    async onDeleteClick(id: string): Promise<void> {
        await this.addressService.delete(id);

        this.checkoutStateService.removeAddress(id);

        if (!this.checkoutStateService.hasAddresses) {
            this.router.navigate([RouteKeys.CheckoutAddressAdd]);
        }
    }
}
