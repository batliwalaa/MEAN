import { CryptoService, SESMailerService, UserService } from '..';
import { User, VerificationType } from '../../models';
import { EmailVerifyRepository } from '../../repositories';
import { BaseEmail } from './base.email';

export class OrderConfirmationEmail extends BaseEmail {
    constructor(
        private emailVerifyRepository: EmailVerifyRepository,
        cryptoService: CryptoService,
        userService: UserService,
        sesMailerService: SESMailerService
    ) {
        super(sesMailerService, userService, cryptoService);
    }

    protected async save(
        parameters: Array<{ key: string; value: string }>,
        user: User,
        emailResponse: string,
        sessionID: string,
        verificationType: VerificationType
    ): Promise<void> {
        const hash = <VerificationType>parameters.find((p) => p.key.toLowerCase() === 'hash')?.value ?? '';
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

    protected getEmail(parameters: Array<{ key: string; value: any }>): { key: string; value: any } {
        return parameters.find((p) => p.key === 'emailID')
    }

    protected getTemplateName(): string {
        return 'order-confirmation';
    }

    protected async getAdditionalParameters(user: User, verificationType: VerificationType): Promise<Array<{ key: string; value: string }>> {
        return await Promise.resolve([]);
    }

    protected getExpiresEnvironmentKey(): string {
        return '';
    }
}
