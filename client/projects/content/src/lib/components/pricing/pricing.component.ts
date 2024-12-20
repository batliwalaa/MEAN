import { Component, Input } from '@angular/core';
import { PreviewComponent } from '../../../../../checkout/src/lib/components/child-components/preview/preview.component';
import { ConfigService } from '@common/src/lib/services/config.service';
import { IConfiguration } from '@common/src/public-api';

@Component({
    selector: 'ui-pricing-component',
    templateUrl: './pricing.component.html',
    styleUrls: ['./pricing.component.scss'],
})
export class PricingComponent {
    @Input() pricing: any;
    @Input() metadata: any;

    configuration: IConfiguration;

    constructor(configService: ConfigService){
        this.configuration = configService.getConfiguration();
    }

    getDiscountPercent(discount: number): string {
        if (discount === 0 || discount === null || isNaN(discount)) {
            return '';
        }

        return `${discount}%`;
    }

    toFixed(value: number): string {
        if (value) {
            return value.toFixed(2);
        }

        return '';
    }

    get showAllTaxesInclusive(): boolean {
        return this.configuration.showAllTaxInclusive ?? false;
    }

    get currencySymbol(): string {
        return this.configuration.currencySymbol;
    }
}
