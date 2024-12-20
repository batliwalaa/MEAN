import { Injectable } from '../core/decorators';
import { EmailVerifyRepository, UserRepository } from '../repositories';
import { VerificationState, EmailVerify, VerificationType } from '../models';

@Injectable()
export class VerificationService {
    constructor(private emailVerifyRepository: EmailVerifyRepository, private userRepository: UserRepository) {}

    public async verify(key: string): Promise<{ state: VerificationState; type?: VerificationType; userName: string }> {
        let state: VerificationState = VerificationState.NotFound;

        const hash = Buffer.from(key, 'base64').toString('utf-8');
        const emailVerify: EmailVerify = await this.emailVerifyRepository.getByHash(hash);

        if (emailVerify) {
            if (emailVerify.expires > Date.now()) {
                await this.emailVerifyRepository.setVerifiedState(hash);
                if (emailVerify.verificationType === VerificationType.NewAccountVerify) {
                    await this.userRepository.setEmailVerified(emailVerify.email);
                }

                state = VerificationState.Verified;
            } else {
                state = VerificationState.Expired;
            }
        }

        return {
            state,
            type: (emailVerify && emailVerify.verificationType) || null,
            userName: (emailVerify && emailVerify.email) || '',
        };
    }
}
