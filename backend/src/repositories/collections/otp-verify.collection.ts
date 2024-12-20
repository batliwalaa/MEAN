import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { OtpVerifyModel } from '../models/otp-verify.model';

const OtpVerifyCollection = () => {
    return DatabaseConnection().model<OtpVerifyModel>('OtpVerifyModel', new Schema<OtpVerifyModel>(), 'OtpVerify');
};

export default OtpVerifyCollection;
