import { NgModule } from '@angular/core';

import { CommonAppModule } from '@common/src/public-api';
import { CheckoutRoutingModule } from './routing-module/checkout-routing.module';

import { AddressSelectComponent } from './components/child-components/address-select/address-select.component';
import { AddressComponent } from './components/child-components/address/address.component';
import { CheckoutComponent } from './components/checkout.component';
import { DeliveryOptionsComponent } from './components/child-components/delivery-options/delivery-options.component';
import { DeliverySlotComponent } from './components/child-components/delivery-slot/delivery-slot.component';
import { TabDesktopComponent } from './components/child-components/delivery-slot/child-components/tab-desktop/tab-desktop.component';
import { TabMobileComponent } from './components/child-components/delivery-slot/child-components/tab-mobile/tab-mobile.component';
import { SlotMobileComponent } from './components/child-components/delivery-slot/child-components/slot-mobile/slot-mobile.component';
import { SlotDesktopComponent } from './components/child-components/delivery-slot/child-components/slot-desktop/slot-desktop.component';
import { PaymentSuccessComponent } from './components/child-components/payment/success/payment-success.component';
import { PaymentFailureComponent } from './components/child-components/payment/failure/payment-failure.component';
import { PreviewComponent } from './components/child-components/preview/preview.component';

@NgModule({
    declarations: [
        AddressSelectComponent,
        AddressComponent,
        DeliveryOptionsComponent,
        CheckoutComponent,
        DeliverySlotComponent,
        TabMobileComponent,
        TabDesktopComponent,
        SlotMobileComponent,
        SlotDesktopComponent,
        PaymentSuccessComponent,
        PaymentFailureComponent,
        PreviewComponent
    ],
    imports: [CommonAppModule, CheckoutRoutingModule]
})
export class CheckoutModule {}
