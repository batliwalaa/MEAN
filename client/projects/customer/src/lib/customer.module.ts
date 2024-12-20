import { NgModule } from '@angular/core';

import { CommonAppModule } from '@common/src/public-api';
import { AccountRoutingModule } from './routing-module/account-routing.module';
import { CustomerRoutingModule } from './routing-module/customer-routing.module';

import { NewCustomerComponent } from './components/new-customer/new-customer.component';
import { OtpVerificationComponent } from './components/otp-verification/otp-verification.component';
import { EmailVerificationComponent } from './components/email-verification/email-verification.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { AccountComponent } from './components/account/account.component';
import { HomeComponent } from './components/account/home/home.component';
import { OrderListComponent } from './components/account/orders/order-list/order-list.component';
import { OrderDetailComponent } from './components/account/orders/child-components/order-detail/order-detail.component';
import { OrderHeaderComponent } from './components/account/orders/child-components/order-header/order-header.component';
import { OrderWrapperComponent } from './components/account/orders/child-components/order-wrapper/order-wrapper.component';
import { OrderComponent } from './components/account/orders/order/order.component';
import { InvoiceComponent } from './components/account/orders/child-components/invoice/invoice.component';
import { ProfileComponent } from './components/account/profile/profile.component';
import { ProfileChangeComponent } from './components/account/profile/child-components/profile-change/profile-change.component';
import { AddressHomeComponent } from './components/account/addresses/address-home.component';
import { AccountAddressComponent } from './components/account/addresses/child-components/address/account-address.component';
import { OrderStatusComponent } from './components/account/orders/child-components/order-status/order-status.component';

@NgModule({
    declarations: [
        NewCustomerComponent,
        OtpVerificationComponent,
        EmailVerificationComponent,
        PasswordResetComponent,
        ForgotPasswordComponent,
        AccountComponent,
        OrderListComponent,
        HomeComponent,
        OrderDetailComponent,
        OrderHeaderComponent,
        OrderWrapperComponent,
        OrderComponent,
        InvoiceComponent,
        ProfileComponent,
        ProfileChangeComponent,
        AddressHomeComponent,
        AccountAddressComponent,
        OrderStatusComponent
    ],
    imports: [       
        CommonAppModule,
        AccountRoutingModule,
        CustomerRoutingModule  
    ],
    exports: [
        OtpVerificationComponent,
        EmailVerificationComponent,
        PasswordResetComponent,
        ForgotPasswordComponent,
        AccountComponent,
        InvoiceComponent
    ],
})
export class CustomerModule {}
