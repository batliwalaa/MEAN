import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent, ShoppingCartItem, WINDOW } from '@common/src/public-api';
import { from } from 'rxjs';
import { delay, first } from 'rxjs/operators';

@Component({
    selector: 'ui-add-to-shoppingcart-quantity',
    templateUrl: './add-to-shoppingcart-quantity.component.html',
    styleUrls: ['./add-to-shoppingcart-quantity.component.scss'],
})
export class AddToShoppingcartQuantityComponent extends BaseComponent {
    @Input() item: ShoppingCartItem;
    @Input() metadata: any;
    quantity = 1;
    ignoreMediaQueries: true;
    disable = false;

    constructor(
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    onAddToBasket(): void {
        this.disable = true;
        from([0]).pipe(delay(this.metadata.enableDelay || 5000), first()).subscribe(_ => this.disable = false);
    }
}
