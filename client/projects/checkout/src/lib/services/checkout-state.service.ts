import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {
    Address,
    AvailableSlot,
    ShoppingCartStateService,
    ShoppingCart,
    DataStoreService,
} from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class CheckoutStateService {
    private _addresses: Array<Address> = [];
    private _selectedAddressIndex = -1;
    private _selectedSlot: AvailableSlot;
    private _shoppingCart: ShoppingCart;

    public selectedDeliveryOption: string;
    public addressStateChange: BehaviorSubject<boolean> = new BehaviorSubject(true);

    constructor(
        private shoppingCartStateService: ShoppingCartStateService,
        private dataStoreService: DataStoreService
    ) {}

    get addresses(): Array<Address> {
        return this._addresses;
    }

    get hasAddresses(): boolean {
        return this._addresses && this._addresses.length > 0;
    }

    get selectedAddress(): Address {
        return this._selectedAddressIndex !== -1 ? this._addresses[this._selectedAddressIndex] : null;
    }

    get currentOrderValue(): number {
        return 0;
    }

    get items(): Array<{
        title: string;
        quantity: number;
        totalPrice: string;
        price: string;
        country: string;
        imageSrc: string;
    }> {
        const shoppingCart = this._shoppingCart;

        if (shoppingCart && shoppingCart.items) {
            return shoppingCart.items.map((item) => {
                let src = '';
                const image = item.images.find((i) => Number(i.size) === 150);
                if (image) {
                    src = image.src;
                }

                return {
                    title: item.title,
                    quantity: item.quantity,
                    totalPrice: (item.quantity * item.pricing.retail).toFixed(2),
                    price: item.pricing.retail.toFixed(2),
                    country: item.country,
                    imageSrc: src,
                };
            });
        }

        return null;
    }

    get selectedSlot(): AvailableSlot {
        return this._selectedSlot;
    }

    set selectedSlot(slot: AvailableSlot) {
        this._selectedSlot = slot;
    }

    async setSelectedAddress(): Promise<void> {
        const defaultAddressIndex = this._addresses.findIndex((a) => a.isDefaultAddress === true);
        this._selectedAddressIndex = defaultAddressIndex === -1 ? 0 : defaultAddressIndex;
        return Promise.resolve();
    }

    async saveState(): Promise<void> {
        await this.dataStoreService.push('checkout-state', {
            addresses: this._addresses,
            selectedAddressIndex: this._selectedAddressIndex,
            selectedSlot: this._selectedSlot,
            shoppingCart: this.shoppingCartStateService.shoppingCart,
        });
    }

    async clearState(): Promise<void> {
        await this.dataStoreService.push('checkout-state', null);
    }

    async setState(): Promise<void> {
        const state = await this.dataStoreService.get('checkout-state');

        if (state) {
            this._addresses = state.addresses;
            this._selectedAddressIndex = state.selectedAddressIndex;
            this._selectedSlot = state.selectedSlot;
            this._shoppingCart = state.shoppingCart;
        }
    }

    setSelectedAddressIndex(index: number): void {
        this._selectedAddressIndex = index;
    }

    removeAddress(id: string): void {
        const index = this._addresses.findIndex((a) => a._id === id);

        this._addresses.splice(index, 1);
    }

    addAddress(address: Address): number {
        let index = -1;

        if (!!address._id) {
            index = this._addresses.findIndex((a) => a._id === address._id);
        }

        if (index === -1) {
            if (address.isDefaultAddress === true) {
                this._addresses.splice(0, 0, address);
                index = 0;
            } else {
                this._addresses.push(address);
                index = this._addresses.length - 1;
            }
        }

        if (this._addresses.length === 1) {
            this._addresses[0].isDefaultAddress = true;
        } else if (address.isDefaultAddress === true) {
            this._addresses.forEach((a, i) => {
                if (i !== 0) {
                    a.isDefaultAddress = false;
                }
            });
        }

        return index;
    }

    clearShoppingCart(): void {
        this.shoppingCartStateService.reset();
    }
}
