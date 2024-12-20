import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentCompleteResponse } from '@checkout/src/lib/types/payment-complete-response';
import { BaseComponent, DataStoreService, MenuStateService, ShoppingCartStateService, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-payment-success-component',
    templateUrl: './payment-success.component.html',
    styleUrls: ['./payment-success.component.scss'],
})
export class PaymentSuccessComponent extends BaseComponent {
    metadata: any;
    paymentResponse: PaymentCompleteResponse;

    constructor(
        dataStoreService: DataStoreService,
        menuStateService: MenuStateService,
        @Inject(WINDOW) window: Window,
        router: Router,
        private activatedRoute: ActivatedRoute,
        private shoppingCartStateService: ShoppingCartStateService
    ) {
        super(router, window, menuStateService, dataStoreService);
        this.menuStateService.changeShowMainMenu(true);
    }

    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata['PaymentSuccess'];
        this.paymentResponse = await this.dataStoreService.get('payment-result') as PaymentCompleteResponse;
        await this.dataStoreService.push('payment-result', null);
        this.shoppingCartStateService.reset();
    }
}
