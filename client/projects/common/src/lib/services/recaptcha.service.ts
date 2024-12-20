import { Injectable } from '@angular/core';
import { DataStoreService } from './data-store.service';
import { VerificationService } from './verification.service';
import { ConfigService } from './config.service';
import { TokenService } from './token.service';

@Injectable({
    providedIn: 'root',
})
export class RecaptchaService {
    private recaptchaKey: string;
    private recaptchaUse: boolean;

    constructor(
        private dataStoreService: DataStoreService,
        private verificationService: VerificationService,
        private tokenService: TokenService,
        configService: ConfigService
    ) {
        this.recaptchaKey = configService.getConfiguration().recaptchaSiteKey;
        this.recaptchaUse = configService.getConfiguration().recaptchaUse;
    }

    public async execute(
        action: string
    ): Promise<{ state: 'RecaptchaVerificationSuccess' | 'RecaptchaVerificationFailure' }> {
        if (this.recaptchaUse) {
            await this.dataStoreService.push('recaptcha-token', null);
            return await this.executeRecaptcha(action);
        }

        return await Promise.resolve({ state: 'RecaptchaVerificationSuccess' });
    }

    private async executeRecaptcha(
        action: string
    ): Promise<{ state: 'RecaptchaVerificationSuccess' | 'RecaptchaVerificationFailure' }> {
        return new Promise((resolve, reject) => {
            // @ts-ignore
            greptcha.ready(() => {
                // @ts-ignore
                grecaptcha.execute(this.recaptchaKey, { action }).then(async (token: any) => {
                    try {
                        await this.dataStoreService.push('recaptcha-token', token);
                        await this.tokenService.xsrf();
                        const state = await this.verificationService.verifyReCaptcha();
                        resolve(state);
                    } catch (e) {
                        reject({ state: 'RecaptchaVerificationFailure' });
                    }
                }, reject);
            });
        });
    }
}
