import { Model } from 'mongoose';
import { Injectable } from '../core/decorators';

import { OtpVerifyCollection } from './collections';
import { OtpVerifyModel } from './models/otp-verify.model';
import { OtpVerify, VerificationType } from '../models';

@Injectable()
export class OtpVerifyRepository {
    private otpVerifyCollection: Model<OtpVerifyModel, any>;

    constructor() {
        this.otpVerifyCollection = OtpVerifyCollection();
    }

    public async save(otpVerify: OtpVerify): Promise<void> {
        await this.otpVerifyCollection.collection.insertMany([otpVerify], { bypassDocumentValidation: true });
    }

    public async getByCode(code: string): Promise<OtpVerify> {
        return await this.otpVerifyCollection.collection.findOne({
            code: code,
            smsSentStatus: 'Success',
            active: true,
            verificationReceivedDate: { $exists: false },
        });
    }

    public async setResendFlag(isoCode: string, mobile: string, verificationType: VerificationType): Promise<void> {
        await this.otpVerifyCollection.collection.updateMany(
            { isoCode, mobile, verificationType, active: true },
            { $set: { active: false, resend: true, expires: Date.now() - 10000 } }
        );
    }

    public async setEmailOtpResendFlag(email: string, verificationType: VerificationType): Promise<void> {
        await this.otpVerifyCollection.collection.updateMany(
            { emailID: email, verificationType, active: true },
            { $set: { active: false, resend: true, expires: Date.now() - 10000 } }
        );
    }

    public async setVerifiedState(code: string): Promise<void> {
        await this.otpVerifyCollection.collection.updateOne(
            { code },
            { $set: { active: false, verificationReceivedDate: Date.now() } },
            { bypassDocumentValidation: true }
        );
    }

    public async setResendState(hash: string): Promise<void> {
        await this.otpVerifyCollection.collection.updateOne(
            { hash },
            { $set: { active: false, resend: true } },
            { bypassDocumentValidation: true }
        );
    }
}
