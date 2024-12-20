import { IRequest } from "../../core/mediator/request";
import { UpdateOrderStatusResponse } from '..';
import { OrderStatus } from "../../models";
import { stat, statSync } from "fs";

export class UpdateOrderStatusRequest implements IRequest<UpdateOrderStatusResponse> {
    readonly orderID: string;
    readonly status: OrderStatus;
    readonly userID: string;

    constructor(orderID: string, status: OrderStatus, userID: string) {
        this.orderID = orderID;
        this.status = status;
        this.userID = userID;
    }
}
