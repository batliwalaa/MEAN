import { Document } from 'mongoose';
import { OtpVerify } from '../../models/otp-verify';

export interface OtpVerifyModel extends OtpVerify, Document {}
