import { Model } from 'mongoose';
import { Injectable } from '../core/decorators';
import { OrderRouteDetail } from '../models';
import OrderRouteDetailCollection from './collections/order-route-detail.collection';
import { OrderRouteDetailModel } from './models/order-route-detail.model';

@Injectable()
export class OrderRouteDetailRepository {
    private orderRouteDetailCollection: Model<OrderRouteDetailModel, any>;

    constructor() {
        this.orderRouteDetailCollection = OrderRouteDetailCollection();
    }

    public async save(OrderRouteDetail: OrderRouteDetail): Promise<string> {
        const options = await this.orderRouteDetailCollection.collection.insertOne(OrderRouteDetail, {
            bypassDocumentValidation: true,
        });

        return options.insertedId.toString();
    }
}
