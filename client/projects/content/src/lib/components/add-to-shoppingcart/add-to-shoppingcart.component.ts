import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, Product, ShoppingCartStateService, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-add-to-shoppingcart',
    templateUrl: './add-to-shoppingcart.component.html',
    styleUrls: ['./add-to-shoppingcart.component.scss'],
})
export class AddToBasketComponent extends BaseComponent {
    @Input() item: Product;
    @Input() quantity: number;
    @Input() metadata: any;
    @Output() addToBasket = new EventEmitter<void>();

    constructor(
        private shoppingcartStateService: ShoppingCartStateService,
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    addToBasketClick() {
        this.addToBasket.emit();
        this.shoppingcartStateService.addItemToBasket(this.item, this.quantity);
    }
}
