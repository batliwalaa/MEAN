import { CryptoService, SESMailerService, UserService } from '..';
import { User, VerificationType } from '../../models';
import { EmailVerifyRepository } from '../../repositories';
import { BaseEmail } from './base.email';

export class UserVerificationEmail extends BaseEmail {
    constructor(
        private emailVerifyRepository: EmailVerifyRepository,
        cryptoService: CryptoService,
        userService: UserService,
        sesMailerService: SESMailerService
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
        const hash = <VerificationType>parameters.find((p) => p.key.toLowerCase() === 'hash').value;
        try {
            const expires = this.getExpires();
            await this.emailVerifyRepository.setResendFlag(user.emailId, verificationType);
            await this.emailVerifyRepository.save({
                _id: null,
                dateSent: Date.now(),
                active: true,
                hash,
                email: user.emailId,
                emailSentStatus: 'Success',
                verificationType: verificationType,
                expires,
                sessionID,
                emailResponse,
            });
        } catch(e) {
            this.logErrorMessage('save', verificationType, e, this.constructor.name, 'emailVerifyRepository');
        }
    }

    protected getTemplateName(): string {
        return 'verify';
    }

    protected async getAdditionalParameters(user: User, verificationType: VerificationType): Promise<Array<{ key: string; value: string }>> {
        try {
            const hash = await this.getHash(user.emailId);
            const url = this.getHashedUrl('EMAIL_VERIFY_URL', hash);

            return [
                { key: 'hash', value: hash },
                { key: '[verifyurl]', value: url },
                { key: '[firstname]', value: user.firstName }
            ];

        } catch (e) {
            this.logErrorMessage('hash', verificationType, e, this.constructor.name);
        }
    }
    
    protected getExpiresEnvironmentKey(): string {
        return 'EMAIL_VERIFY_URL_VALIDITY';
    }
}
