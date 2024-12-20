import { Component, Inject, Input } from '@angular/core';
import {  Router } from '@angular/router';

import { BaseComponent, ConfigService, NavigationService, RouteKeys, ShoppingCartStateService, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-proceed-to-buy',
    templateUrl: './proceed-to-buy.component.html',
    styleUrls: ['./proceed-to-buy.component.scss'],
})
export class ProceedToBuyComponent extends BaseComponent {
    totalToPay: string;
    totalQty = 0;
    currencySymbol: string;
    @Input() metadata: any;

    constructor(
        private shoppingcartStateService: ShoppingCartStateService,
        private navigationService: NavigationService,
        @Inject(WINDOW) window: any,
        router: Router,
        configService: ConfigService
    ) {
        super(router, window);
        
        this.currencySymbol = configService.getConfiguration().currencySymbol;
    }

    protected async init(): Promise<void> {
        this.refreshCart();

        this.shoppingcartStateService.cartStateChange.subscribe((state) => {
            if (state) {
                this.refreshCart();
            }
        });

        return Promise.resolve();
    }

    private refreshCart(): void {
        let total = 0;
        let qty = 0;

        this.shoppingcartStateService.groupBasketItems.subscribe((s) => {
            s.forEach((i) => {
                total += i.quantity * i.pricing.retail;
                qty += i.quantity;
            });

            this.totalToPay = (Math.round(total * 100) / 100).toFixed(2);
            this.totalQty = qty;
        });
    }

    public async buyNowClick(): Promise<void> {
        await this.navigationService.clear();
        await this.navigationService.navigateForUrl(RouteKeys.Checkout);
        // this.router.navigate([RouteKeys.Checkout]);
    }
}
