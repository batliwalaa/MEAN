import { Injectable } from '../core/decorators';
import { EmailTypeFactory } from '../factory/email-type.factory';

@Injectable()
export class EmailService {
    constructor(private emailTypeFactory: EmailTypeFactory) {}

    public async sendEmail(parameters: Array<{ key: string; value: any }>): Promise<void> {
        const emailType = parameters.find(p => p.key === 'emailType').value;        
        const emailers = this.emailTypeFactory.get(emailType);

        for (const e of emailers) {
            await e.sendEmail(parameters);   
        }
    }
}
