import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, IInputValue, ShoppingCartStateService, ShoppingCartItem, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-shoppingcart-item-container',
    templateUrl: './shoppingcart-item-container-component.html',
    styleUrls: ['./shoppingcart-item-container-component.scss'],
})
export class ShoppingcartItemContainerComponent extends BaseComponent {
    @Input() item: ShoppingCartItem;
    @Input() metadata: any;

    constructor(
        @Inject(WINDOW) window: any,
        router: Router,
        private shoppingcartStateService: ShoppingCartStateService
    ) {
        super(router, window);
    }

    onQuantityChange(inputValue: IInputValue): void {
        this.shoppingcartStateService.updateItemInBasket(this.item, inputValue.value);
    }

    getMetadata(): any {
        return { defaultValue: this.item.quantity, min: 1, max: 20 };
    }

    deleteFromBasket(): void {
        this.shoppingcartStateService.deleteItemFromBasket(this.item);
    }

    get imageUrl(): string {
        if (this.item && Array.isArray(this.item.images)){
            const image = this.item.images.find(i => Number(i.size) === 0);

            if (image) {
                return image.src;
            }
        }
        return '';
    }

    get packaging(): string {
        let value: string = '';
        const size = this.item.details.find(d => d.title.toLowerCase() === 'size')
        const sizePack = this.item.details.find(d => d.title.toLowerCase() === 'pack');

        if (size) {
            value = size.value;
        }

        if (sizePack) {
            value = `${value} ${sizePack.value}`;
        }

        return value;
    }
}
