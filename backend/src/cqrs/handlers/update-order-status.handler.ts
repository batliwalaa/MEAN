import { IHandler } from '../../core/mediator/handler';
import { Injectable } from '../../core/decorators';
import { UpdateOrderStatusRequest, UpdateOrderStatusResponse } from '..';
import { OrderService } from '../../services';

@Injectable()
export class UpdateOrderStatusHandler implements IHandler<UpdateOrderStatusRequest, UpdateOrderStatusResponse> {
    constructor(
        private orderService: OrderService
    ){}

    public async handle(request: UpdateOrderStatusRequest): Promise<UpdateOrderStatusResponse> {
        return await this.orderService.setOrderStatus(request.orderID, request.status, request.userID);
    }
}
