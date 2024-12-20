import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { OrderRouteDetailModel } from '../models/order-route-detail.model';

const OrderRouteDetailCollection = () => {
    return DatabaseConnection().model<OrderRouteDetailModel>(
        'OrderRouteDetailModel',
        new Schema<OrderRouteDetailModel>(),
        'RouteDetail'
    );
};

export default OrderRouteDetailCollection;
