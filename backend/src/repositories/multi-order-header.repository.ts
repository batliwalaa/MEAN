import { MultiOrderHeaderCollection } from './collections';
import { MultiOrderHeaderModel } from './models/multi-order-header.model';
import { Injectable } from '../core/decorators';
import { Model, Types } from 'mongoose';
import { MultiOrderHeader, OrderStatus } from '../models';
import { OrderPaymentStatus } from '../models/enums/order-payment-status';

@Injectable()
export class MultiOrderHeaderRepository {
    private multiOrderHeaderCollection: Model<MultiOrderHeaderModel, any>;

    constructor() {
        this.multiOrderHeaderCollection = MultiOrderHeaderCollection();
    }

    public async save(multiOrderHeader: MultiOrderHeader): Promise<MultiOrderHeader> {
        const options = await this.multiOrderHeaderCollection.collection.insertOne(multiOrderHeader, { bypassDocumentValidation: true });

        multiOrderHeader._id = options.insertedId.toString();

        return multiOrderHeader;
    }

    public async getByID(id: string): Promise<MultiOrderHeader> {
        const r = await this.multiOrderHeaderCollection.findById({_id: Types.ObjectId(id)});

        return r && r._doc || r;
    }

    public async setStatus(
        orderID: string,
        paymentStatus?: OrderPaymentStatus,
        paymentResponseID?: string
    ): Promise<void> {
        let changes = {};
        changes = { orderPaymentStatus: paymentStatus };

        if (!!paymentResponseID) {
            changes = { ...changes, paymentID: paymentResponseID };
        }

        await this.multiOrderHeaderCollection.collection.updateOne(
            { _id: Types.ObjectId(orderID) },
            { $set: changes },
            { bypassDocumentValidation: true});
    }
}
