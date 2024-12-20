import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddressComponent } from '../components/child-components/address/address.component';
import { AddressSelectComponent } from '../components/child-components/address-select/address-select.component';
import { DeliveryOptionsComponent } from '../components/child-components/delivery-options/delivery-options.component';
import { DeliverySlotComponent } from '../components/child-components/delivery-slot/delivery-slot.component';

import { AddressResolver } from '../resolvers/address.resolver';
import { DeliveryOptionsResolver } from '../resolvers/delivery-options.resolver';
import { DeliverySlotsResolver } from '../resolvers/delivery-slots.resolver';
import { PaymentFailureComponent } from '../components/child-components/payment/failure/payment-failure.component';
import { PaymentSuccessComponent } from '../components/child-components/payment/success/payment-success.component';
import { StateCountyProvinceResolver } from '../resolvers/state-county-province.resolver';
import { PreviewComponent } from '../components/child-components/preview/preview.component';
import { AuthGuard, MetadataResolver } from '@common/src/public-api';
import { PaymentGuard } from '../guards/payment.guard';
import { AvailableLoyaltyPointsResolver } from '../resolvers/available-loyalty-points.resolver';
import { CheckoutComponent } from '../components/checkout.component';
import { BurgerMenuResolver, MenuResolver } from '@menu/src/public-api';

const routes: Routes = [
    {
        path: '',
        component: CheckoutComponent,
        canActivate: [AuthGuard],
        children: [
            { path: '', redirectTo: 'address/select', pathMatch: 'full' },
            {
                path: 'address/select',
                component: AddressSelectComponent,
                canActivate: [AuthGuard],
                data: { resourceKeys: ['Checkout'] },
                resolve: { metadata: MetadataResolver, AddressResolver },
            },
            {
                path: 'address/add',
                component: AddressComponent,
                canActivate: [AuthGuard],
                data: { resourceKeys: ['Checkout'] },
                resolve: {
                    metadata: MetadataResolver,
                    states: StateCountyProvinceResolver,
                },
            },
            {
                path: 'address/edit/:id',
                component: AddressComponent,
                canActivate: [AuthGuard],
                data: { resourceKeys: ['Checkout'] },
                resolve: {
                    addresses: AddressResolver,
                    metadata: MetadataResolver,
                    states: StateCountyProvinceResolver,
                },
            },
            {
                path: 'delivery/options',
                component: DeliveryOptionsComponent,
                canActivate: [AuthGuard],
                data: { resourceKeys: ['Checkout'] },
                resolve: {
                    metadata: MetadataResolver,
                    deliveryOptions: DeliveryOptionsResolver,
                },
            },
            {
                path: 'delivery/slots',
                component: DeliverySlotComponent,
                canActivate: [AuthGuard],
                data: { resourceKeys: ['Checkout'] },
                resolve: {
                    metadata: MetadataResolver,
                    slots: DeliverySlotsResolver,
                },
            },
            {
                path: 'payment/success',
                component: PaymentSuccessComponent,
                canActivate: [PaymentGuard],
                data: { resourceKeys: ['PaymentSuccess', 'BurgerMenu'] },
                resolve: {
                    metadata: MetadataResolver,
                    menuData: MenuResolver,
                    burgerMenu: BurgerMenuResolver,
                },
            },
            {
                path: 'payment/failure',
                component: PaymentFailureComponent,
                canActivate: [PaymentGuard],
                data: { resourceKeys: ['PaymentFailure', 'BurgerMenu'] },
                resolve: {
                    metadata: MetadataResolver,
                    menuData: MenuResolver,
                    burgerMenu: BurgerMenuResolver,
                },
            },
            {
                path: 'preview',
                component: PreviewComponent,
                canActivate: [AuthGuard],
                data: { resourceKeys: ['Checkout'] },
                resolve: {
                    metadata: MetadataResolver,
                    deliveryOptions: DeliveryOptionsResolver,
                    loyalty: AvailableLoyaltyPointsResolver,
                },
            },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CheckoutRoutingModule {}
