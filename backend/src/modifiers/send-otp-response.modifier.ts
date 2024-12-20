import { IModifier } from '../models';

export class SendOtpResponseModifier implements IModifier {
    async modify(content: any): Promise<any> {
        return await Promise.resolve({});
    }
}
