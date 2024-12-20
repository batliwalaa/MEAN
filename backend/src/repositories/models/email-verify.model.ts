import { Document } from 'mongoose';
import { EmailVerify } from '../../models';

export interface EmailVerifyModel extends EmailVerify, Document {}
