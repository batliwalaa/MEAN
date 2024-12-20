import { Document } from 'mongoose';
import { PaymentResponse } from '../../models';
export interface PaymentResponseModel extends PaymentResponse, Document {}
