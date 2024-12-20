import { RedisService } from '../../cache';
import { PubSubChannelKeys } from '../../keys/redis-pub-sub-channel.keys';
import { OtpVerifyService, EmailService } from '../../services';
import { isEmptyOrWhiteSpace } from '../../core/utils';
import { Injector } from '../../core/di/injector';
import { EmailType, VerificationType } from '../../models';



export default async () => {
    const redisService = Injector.resolve<RedisService>(RedisService);
    const otpVerifyService = Injector.resolve<OtpVerifyService>(OtpVerifyService);
    const emailService = Injector.resolve<EmailService>(EmailService);

    function getEmailType(verificationType: VerificationType): EmailType {
        switch(verificationType) {
            case VerificationType.NewAccountVerify:
                return EmailType.Verification
            case VerificationType.ProfileChange:
                return EmailType.ProfileChange;
            case VerificationType.ResetPassword:
                return EmailType.PasswordReset;
            default:
                return EmailType.Dummy
        }
    }

    await redisService.subscribe(PubSubChannelKeys.VerificationChannel, async (channel: string, message: string) => {
        if (channel !== PubSubChannelKeys.VerificationChannel) return;

        const msg = JSON.parse(message);

        if (msg) {
            if (!isEmptyOrWhiteSpace(msg.mobile) && !isEmptyOrWhiteSpace(msg.isoCode)) {
                await otpVerifyService.sendOtp(msg.sessionID, msg.isoCode, msg.mobile, msg.type);
            }

            if (!isEmptyOrWhiteSpace(msg.emailID)) {
                await emailService.sendEmail([
                    { key: 'sessionID', value: msg.sessionID },
                    { key: 'emailID', value: msg.emailID },
                    { key: 'newEmailID', value: msg.newEmailID },
                    { key: 'verificationType', value: <VerificationType>msg.type },
                    { key: 'emailType', value: getEmailType(<VerificationType>msg.type)}
                ]);
            }
        }
    });
};
