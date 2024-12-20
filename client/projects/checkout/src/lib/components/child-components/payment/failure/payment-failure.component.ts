import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentCompleteResponse } from '@checkout/src/lib/types/payment-complete-response';
import { BaseComponent, DataStoreService, MenuStateService, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-payment-failure-component',
    templateUrl: './payment-failure.component.html',
    styleUrls: ['./payment-failure.component.scss'],
})
export class PaymentFailureComponent extends BaseComponent {
    metadata: any;
    paymentResponse: PaymentCompleteResponse;

    constructor(
        private activatedRoute: ActivatedRoute,
        @Inject(WINDOW) window: Window,
        router: Router,
        dataStoreService: DataStoreService,
        menuStateService: MenuStateService
    ) {
        super(router, window, menuStateService, dataStoreService);
        this.menuStateService.changeShowMainMenu(true);
    }

    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata['PaymentFailure'];
        this.paymentResponse = await this.dataStoreService.get('payment-result') as PaymentCompleteResponse;
        await this.dataStoreService.push('payment-result', null);
    }
}
