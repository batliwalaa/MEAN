import { Model } from 'mongoose';
import { Injectable } from '../core/decorators';
import { PaymentResponse } from '../models';
import PaymentResponseCollection from './collections/payment-response.collection';
import { PaymentResponseModel } from './models/payment-response.model';

@Injectable()
export class PaymentResponseRepository {
    private paymentResponseCollection: Model<PaymentResponseModel, any>;

    constructor() {
        this.paymentResponseCollection = PaymentResponseCollection();
    }

    public async save(response: PaymentResponse): Promise<string> {
        const options = await this.paymentResponseCollection.collection.insertOne(response, {
            bypassDocumentValidation: true,
        });

        return options.insertedId.toString();
    }

    public async get(id: string): Promise<PaymentResponse> {
        return await this.paymentResponseCollection.findById(id).exec();
    }
}
