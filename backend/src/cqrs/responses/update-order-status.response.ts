import { OrderStatus } from '../../models/enums/order-status';

export interface UpdateOrderStatusResponse {
    status: OrderStatus;
    modifiedDate: string;
}