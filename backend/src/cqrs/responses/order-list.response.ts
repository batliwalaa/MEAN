import { Order, Result, OrderSlot } from '../../models';

export interface OrderListResponse {
    orders?: Result<Order>;
    slots?: Array<OrderSlot>;    
}