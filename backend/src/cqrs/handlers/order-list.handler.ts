import { IHandler } from '../../core/mediator/handler';
import { OrderListRequest, OrderListResponse } from '..';
import { Injectable } from '../../core/decorators';
import { OrderService, DeliverySlotService } from '../../services';




@Injectable()
export class OrderListHandler implements IHandler<OrderListRequest, OrderListResponse> {
    constructor(
        private orderService: OrderService,
        private deliverySlotService: DeliverySlotService
    ){}

    public async handle(request: OrderListRequest): Promise<OrderListResponse> {
        const response : OrderListResponse = {};
        response.orders = await this.orderService.search(request.userId, request.pn, request.searchMap)

        if (request.includeSlots) {
            const slots = response.orders.items.map(item => ({
                _id: item.slotId, slotType:item.slotType
            }));           
            response.slots = await this.deliverySlotService.getByIds(slots);    
        }

        return response;      
    };
   
}

