import { CryptoService, UserService } from '..';
import { SESMailerService} from '../ses-mailer.service';
import { Injectable } from '../../core/decorators';
import { User, VerificationType } from '../../models';
import { OtpVerifyRepository } from '../../repositories';
import { BaseEmail } from './base.email';
import generateRandomCharacters from '../../utils/generate-random-characters';

@Injectable()
export class ProfileChangeOtpEmail extends BaseEmail {
    constructor(
        private otpVerifyRepository: OtpVerifyRepository,
        userService: UserService,
        sesMailerService: SESMailerService,
        cryptoService: CryptoService
    ) {
        super(sesMailerService, userService, cryptoService);
    }

    protected getEmail(parameters: Array<{ key: string; value: any }>): { key: string; value: any } {
        return parameters.find((p) => p.key === 'emailID')
    }

    protected async save(
        parameters: Array<{ key: string; value: string }>,
        user: User,
        emailResponse: string,
        sessionID: string,
        verificationType: VerificationType
    ): Promise<void> {
        try {
            const otp = parameters.find((p) => p.key.toLowerCase() === '[otp]')?.value ?? '';
            const expires = this.getExpires();
            let email = parameters.find((p) => p.key.toLowerCase() === '[emailid]')?.value;

            if (!email) {
                email = user.emailId;
            }

            await this.otpVerifyRepository.setEmailOtpResendFlag(email, verificationType);
            await this.otpVerifyRepository.save({
                _id: null,
                code: otp,
                active: true,
                dateSent: Date.now(),
                smsSentGatewayResponse: 'OTP Email sent',
                smsSentStatus: 'Success',
                verificationType,
                expires,
                sessionID,
                emailID: email
            });
        } catch(e) {
            this.logErrorMessage('save', verificationType, e, this.constructor.name, 'otpVerifyRepository');
        }
    }

    protected getTemplateName(): string {
        return 'profile-change';
    }

    protected async getAdditionalParameters(): Promise<Array<{ key: string; value: string }>> {
        const otp = await generateRandomCharacters(8);        

        return [{key: '[otp]', value: otp }];
    }
    protected getExpiresEnvironmentKey(): string {
        return 'PROFILE_CHANGE_OTP_VALIDITY';
    }
}
