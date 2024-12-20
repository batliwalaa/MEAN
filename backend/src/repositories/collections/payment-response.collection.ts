import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { PaymentResponseModel } from '../models/payment-response.model';

const PaymentResponseCollection = () => {
    return DatabaseConnection().model<PaymentResponseModel>(
        'PaymentResponseModel',
        new Schema<PaymentResponseModel>(),
        'PaymentResponse'
    );
};

export default PaymentResponseCollection;
