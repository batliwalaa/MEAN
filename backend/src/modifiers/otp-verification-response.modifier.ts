import { IModifier } from '../models';

export class OtpVerificationResponseModifier implements IModifier {
    async modify(content: any): Promise<any> {
        return await Promise.resolve(content && content.state ? { state: content.state } : null);
    }
}
