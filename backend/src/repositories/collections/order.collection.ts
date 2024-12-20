import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { OrderModel } from '../models/order.model';

const OrderModelCollection = () => {
    return DatabaseConnection().model<OrderModel>('OrderModel', new Schema<OrderModel>(), 'Order');
};

export default OrderModelCollection;
