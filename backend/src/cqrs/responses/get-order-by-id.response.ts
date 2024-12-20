import { OrderSlot } from '../../models';

export interface GetOrderByIdResponse {
    order?: any;
    slot?: OrderSlot;    
}