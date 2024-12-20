import { Injectable } from '../../core/decorators';
import { User, VerificationType } from '../../models';
import { BaseEmail } from './base.email';

@Injectable()
export class DummyEmail extends BaseEmail {
    protected async save(
        parameters: Array<{ key: string; value: string }>,
        user: User,
        emailResponse: string,
        sessionID: string,
        verificationType: VerificationType
    ): Promise<void> {
        await Promise.resolve();
    }

    protected getEmail(parameters: Array<{ key: string; value: any }>): { key: string; value: any } {
        return null;
    }
    
    protected getTemplateName(): string {
        return '';
    }

    protected getExpiresEnvironmentKey(): string {
        return ''
    }

    protected async getAdditionalParameters(user: User, verificationtype: VerificationType): Promise<Array<{ key: string; value: string }>> {
        return await Promise.resolve([]);
    }
}
