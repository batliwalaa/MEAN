import fs from 'fs';

import { CryptoService, SESMailerService, UserService } from '..';
import { Logging } from '../../core/structured-logging/log-manager';
import { Logger } from '../../core/structured-logging/logger';
import { User, VerificationType } from '../../models';

export abstract class BaseEmail {
    protected logger: Logger;

    constructor(
        protected sesMailerService?: SESMailerService,
        protected userService?: UserService,
        protected cryptoService?: CryptoService
    ) {
        this.logger = Logging.getLogger(this.constructor.name);
    }

    public async sendEmail(parameters: Array<{ key: string; value: any }>): Promise<void>{
        const email = this.getEmail(parameters);
        if (!(email && email.value)) return;

        const user = await this.userService.getUserByEmail(email.value);

        if (user) {
            await this.sendMail(
                user,
                parameters.find((p) => p.key.toLowerCase() === 'sessionid').value,
                parameters.find((p) => p.key.toLowerCase() === 'verificationtype').value,
                parameters.find(p => p.key.toLowerCase() === 'newemailid').value
            );
        }
    }

    protected abstract getEmail(parameters: Array<{ key: string; value: any }>): {key: string, value: string};

    protected abstract save(
        parameters: Array<{ key: string; value: string }>,
        user: User,
        emailResponse: string,
        sessionID: string,
        verificationType: VerificationType
    ): Promise<void>;

    protected abstract getTemplateName(): string;

    protected abstract getExpiresEnvironmentKey(): string;

    protected abstract getAdditionalParameters(user: User, verificationtype: VerificationType): Promise<Array<{ key: string; value: string }>>;

    protected getExpires(): number {
        return Date.now() + Number(process.env[this.getExpiresEnvironmentKey()]) * 1000;
    }

    protected async getMailMessage(
        verificationType: VerificationType,
        parameters: Array<{ key: string; value: string }>
    ): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                let messageBody = fs
                    .readFileSync(
                        __dirname + `${process.env.EMAIL_TEMPLATE_PATH}/${this.getTemplateName().toLowerCase()}.template.html`
                    )
                    .toString();

                if (Array.isArray(parameters) && parameters.length > 0) {
                    for (let index = 0; index < parameters.length; index++) {
                        const key = parameters[index].key.replace('[', '\\[').replace(']', '\\]');
                        const re = new RegExp(key, 'g');
                        messageBody = messageBody.replace(re, parameters[index].value);
                    }
                }
                resolve(messageBody);
            } catch (e) {
                reject(e);
            }
        });
    }

    protected logErrorMessage(
        step: string,
        verificationType: VerificationType,
        e: Error,
        mailer: string,
        repositoryName: string = null
    ): void {
        switch (step) {
            case 'hash':
                this.logger.error(
                    `Error: Send email ${verificationType.toLowerCase()} - ${step}`,
                    { action: `${mailer}-cryptoService-hash` },
                    e
                );
                break;
            case 'message':
                this.logger.error(
                    `Error: Send email ${verificationType.toLowerCase()} - ${step}`,
                    { action:  `${mailer}-getMailMessage` },
                    e
                );
                break;
            case 'sendMail':
                this.logger.error(
                    `Error: Send email ${verificationType.toLowerCase()} - ${step}`,
                    { action:  `${mailer}-nodeMailerService-sendMail` },
                    e
                );
                break;
            case 'save':
                this.logger.error(
                    `Error: Send email ${verificationType.toLowerCase()} - ${step}`,
                    { action:  `${mailer}-${repositoryName}-save` },
                    e
                );
                break;
            default:
                this.logger.error(
                    `Error: Send email ${verificationType.toLowerCase()} `,
                    { action: mailer },
                    e
                );
                break;
        }
    }

    protected async getParameters(
        user: User,
        verificationType: VerificationType,
        newEmailID: string
    ): Promise<Array<{ key: string; value: string }>> {
        let parameters: Array<{ key: string; value: string }> = [
            { key: '[site_domain_url]', value: process.env.SITE_DOMAIN_URL },
            { key: '[site_domain]', value: process.env.SITE_DOMAIN },
        ];
        
        parameters.push({ key: '[firstname]', value: user.firstName });
        parameters.push({ key: '[emailid]', value: newEmailID ?? user.emailId });
        
        parameters = parameters.concat(await this.getAdditionalParameters(user, verificationType))

        return parameters;
    }

    protected getHashedUrl(key: string, hash: string): string {
        return process.env[key].replace('[hash]', Buffer.from(hash).toString('base64'));
    }

    protected async getHash(emailId: string): Promise<string> {
        return await this.cryptoService.hash(emailId);
    }

    private async sendMail(
        user: User,
        sessionID: string,
        verificationType: VerificationType,
        newEmailID: string): Promise<void> {
        let step = '';
        try {
            const parameters = await this.getParameters(user, verificationType, newEmailID);
            
            step = 'message';
            const message = await this.getMailMessage(verificationType, parameters);
            this.logger.trace(message, { action: 'sendMail' });

            step = 'sendMail';
            const emailResponse = await this.sesMailerService.sendMail(
                newEmailID ?? user.emailId,
                `AMREET BAZAAR: ${verificationType.toLowerCase()} email`,
                message
            );

            await this.save(parameters, user, emailResponse, sessionID, verificationType);

        } catch (e) {
            this.logErrorMessage(step, verificationType, e, this.constructor.name);
        }
    }
}
