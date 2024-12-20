import { Component, Inject } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent, ShoppingCartStateService, ShoppingCartItemGroup, WINDOW } from '@common/src/public-api';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'ui-shopping-cart',
    templateUrl: './shopping-cart.component.html',
    styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent extends BaseComponent {
    basketItems: Array<ShoppingCartItemGroup> = [];
    totalToPay: string;
    totalQty = 0;
    showItems = false;
    metadata: any;

    constructor(
        private activatedRoute: ActivatedRoute,
        private checkoutStateService: ShoppingCartStateService,
        @Inject(WINDOW) window: any,
        router: Router,
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata['ShoppingCart'];
        this.checkoutStateService.cartStateChange.pipe(takeUntil(this.$destroy)).subscribe((state) => {
            if (state) {
                this.refreshCart();
            }
        });

        return Promise.resolve();
    }

    private refreshCart(): void {
        this.basketItems = [];
        let total = 0;
        let qty = 0;
        this.showItems = !!this.checkoutStateService.shoppingCart && this.checkoutStateService.shoppingCart.items.length !== 0
        if (this.showItems) {
            this.checkoutStateService.groupBasketItems.subscribe((s) => {
                s.forEach((i) => {
                    total += i.quantity * i.pricing.retail;
                    qty += i.quantity;
                });

                this.basketItems.push({ key: s[0].lob, items: s });
                this.totalToPay = (Math.round(total * 100) / 100).toFixed(2);
                this.totalQty = qty;
                this.showItems = this.totalQty > 0;
            });
        }
    }
}
