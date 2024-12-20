import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { EmailVerifyModel } from '../models/email-verify.model';

const EmailVerifyCollection = () => {
    return DatabaseConnection().model<EmailVerifyModel>(
        'EmailVerifyModel',
        new Schema<EmailVerifyModel>(),
        'EmailVerify'
    );
};

export default EmailVerifyCollection;
