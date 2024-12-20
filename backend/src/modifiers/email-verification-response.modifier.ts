import { IModifier } from '../models';

export class EmailVerificationResponseModifier implements IModifier {
    async modify(content: any): Promise<any> {
        return await Promise.resolve({
            state: content.state,
            type: content.type,
            email: content.userName,
        });
    }
}
