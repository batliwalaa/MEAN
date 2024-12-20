import { Inject } from '@angular/core';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent, ConfigService, IConfiguration, IDeliveryOptions, WINDOW } from '@common/src/public-api';
import { CheckoutStateService } from '../../../services/checkout-state.service';

@Component({
    selector: 'ui-delivery-options-component',
    templateUrl: './delivery-options.component.html',
    styleUrls: ['./delivery-options.component.scss'],
})
export class DeliveryOptionsComponent extends BaseComponent {
    private readonly _weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    private readonly _months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];   
    private deliveryOptions: IDeliveryOptions;

    @Input() metadata: any;

    readonly configuration: IConfiguration;
    options: Array<any> = [];
    continue: boolean;   

    constructor(
        private activatedRoute: ActivatedRoute,
        private checkoutStateService: CheckoutStateService,
        @Inject(WINDOW) window: Window,
        router: Router,
        configService: ConfigService
    ) {
        super(router, window);
        this.deliveryOptions;
        this.configuration = configService.getConfiguration();
    }
    
    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata['Checkout'].options;
        this.deliveryOptions = this.activatedRoute.snapshot.data.deliveryOptions;
        this.options = this.metadata.options;

        return Promise.resolve();
    }

    isOptionAvailable(type: string): boolean {
        switch (type.toLowerCase()) {
            case 'free delivery':
                return this.checkoutStateService.currentOrderValue >= 350.0;
            case 'standard delivery':
                return true;
            default:
                return false;
        }
    }

    onContinueClick(): void {}

    isOptionSelected(type: string): boolean {
        return this.checkoutStateService.selectedDeliveryOption === type;
    }

    hasValue(type: string): boolean {
        return type === 'Standard Delivery';
    }

    getOptionValue(type: string): string {
        return (125.0).toFixed(2);
    }

    getUnavailableText(option: any): string {
        if (
            option.type === 'FREE Delivery' &&
            this.checkoutStateService.currentOrderValue < this.deliveryOptions.freeDeliveryMinOrderValue
        ) {
            return `${option.unavailable} ${this.configuration.currencySymbol}${this.deliveryOptions.freeDeliveryMinOrderValue.toFixed(2)}`;
        }
        return option.unavailable;
    }

    getByDate(type: string): string {
        let date = new Date();
        date.setDate(date.getDate() + 3);

        return `${this._weekdays[date.getDay()]}, ${this._months[date.getMonth()]} ${date.getDate()}`;
    }

    getOption(option: any): any {
        return { option };
    }

    onDeliveryOptionChanged(type: string): void {
        this.checkoutStateService.selectedDeliveryOption = type;
        this.continue = true;
    }
}
