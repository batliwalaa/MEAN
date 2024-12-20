import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetadataResolver } from '@common/src/public-api';
import { EmailVerificationComponent } from '../components/email-verification/email-verification.component';
import { ForgotPasswordComponent } from '../components/forgot-password/forgot-password.component';
import { NewCustomerComponent } from '../components/new-customer/new-customer.component';
import { OtpVerificationComponent } from '../components/otp-verification/otp-verification.component';
import { PasswordResetComponent } from '../components/password-reset/password-reset.component';
import { ForgotPasswordResolver } from '../resolvers/forgot-password.resolver';
import { VerifyOtpModelResolver } from '../resolvers/verify-otp-model.resolver';

const routes: Routes = [
    {
        path: 'register',
        component: NewCustomerComponent,
        pathMatch: 'full',
        data: { resourceKeys: ['NewCustomer'] },
        resolve: {
            metadata: MetadataResolver,
        },
        runGuardsAndResolvers: 'always'
    }, {
        path: 'verifyotp',
        component: OtpVerificationComponent,
        pathMatch: 'full',
        data: { resourceKeys: ['OtpVerification'] },
        resolve: {
            verifyOtpModel: VerifyOtpModelResolver,
            metadata: MetadataResolver,
        },
        runGuardsAndResolvers: 'always'
    }, {
        path: 'forgotpassword',
        component: ForgotPasswordComponent,
        pathMatch: 'full',
        data: { resourceKeys: ['ForgotPassword'] },
        resolve: {
            recovery: ForgotPasswordResolver,
            metadata: MetadataResolver,
        },
        runGuardsAndResolvers: 'always'
    }, {
        path: 'email/link/verifyemail/:hash',
        component: EmailVerificationComponent,
        pathMatch: 'full',
        data: { resourceKeys: ['EmailVerification'] },
        resolve: {
            metadata: MetadataResolver,
        },
        runGuardsAndResolvers: 'always'
    }, {
        path: 'passwordreset',
        component: PasswordResetComponent,
        pathMatch: 'full',
        data: { resourceKeys: ['PasswordReset'] },
        resolve: {
            metadata: MetadataResolver,
        },
        runGuardsAndResolvers: 'always'
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class CustomerRoutingModule {}
