import { Model } from 'mongoose';
import { Injectable } from '../core/decorators';

import { EmailVerifyCollection } from './collections';
import { EmailVerifyModel } from './models/email-verify.model';
import { EmailVerify, VerificationType } from '../models';

@Injectable()
export class EmailVerifyRepository {
    private emailVerifyCollection: Model<EmailVerifyModel, any>;

    constructor() {
        this.emailVerifyCollection = EmailVerifyCollection();
    }

    public async save(emailVerify: EmailVerify): Promise<void> {
        await this.emailVerifyCollection.collection.insertMany([emailVerify], { ordered: false });
    }

    public async getByHash(hash: string): Promise<EmailVerify> {
        return await this.emailVerifyCollection.collection.findOne({
            hash,
            active: true,
            verificationReceivedDate: { $exists: false },
        });
    }

    public async setResendFlag(email: string, verificationType: VerificationType): Promise<void> {
        await this.emailVerifyCollection.collection.updateOne(
            { email, verificationType },
            { $set: { active: false, resend: true } },
            { bypassDocumentValidation: true }
        );
    }

    public async setVerifiedState(hash: string): Promise<void> {
        await this.emailVerifyCollection.collection.updateOne(
            { hash },
            { $set: { active: false, verificationReceivedDate: Date.now() } },
            { bypassDocumentValidation: true }
        );
    }

    public async setResendState(hash: string): Promise<void> {
        await this.emailVerifyCollection.collection.updateOne(
            { hash },
            { $set: { active: false, resend: true } },
            { bypassDocumentValidation: true }
        );
    }
}
