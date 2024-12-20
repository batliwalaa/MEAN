import { Injectable } from '../core/decorators';
import { Injector } from '../core/di/injector';
import { EmailType } from '../models';
import {
    DummyEmail,
    OrderConfirmationEmail,
    ProfileChangeOtpEmail,
    SellerOrderConfirmationEmail,
    UserVerificationEmail
} from '../services/emails';
import { BaseEmail } from '../services/emails/base.email';
import { ResetPasswordEmail } from '../services/emails/reset-password.email';

@Injectable()
export class EmailTypeFactory {
    public get<T extends BaseEmail>(emailType: EmailType): Array<T> {
        const emailers: Array<T> = [];
        switch (emailType) {
            case EmailType.OrderConfirmation:
                emailers.push(<any>Injector.resolve<OrderConfirmationEmail>(OrderConfirmationEmail));
                emailers.push(<any>Injector.resolve<SellerOrderConfirmationEmail>(SellerOrderConfirmationEmail));
                break;
            case EmailType.Verification:
                emailers.push(<any>Injector.resolve<UserVerificationEmail>(UserVerificationEmail));
                break;
            case EmailType.PasswordReset:
                emailers.push(<any>Injector.resolve<ResetPasswordEmail>(ResetPasswordEmail));
                break;
            case EmailType.ProfileChange:
                emailers.push(<any>Injector.resolve<ProfileChangeOtpEmail>(ProfileChangeOtpEmail));
                break;
            default:
                emailers.push(<any>Injector.resolve<DummyEmail>(DummyEmail));
        }

        return emailers;
    }
}
