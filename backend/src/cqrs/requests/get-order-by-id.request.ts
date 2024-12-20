import { IRequest } from "../../core/mediator/request";
import { GetOrderByIdResponse } from '..';

export class GetOrderByIdRequest implements IRequest<GetOrderByIdResponse> {
    readonly includeSlot: boolean;
    readonly orderId: string;
    readonly userId: any;

    constructor( 
        orderId: string,
        userId: any,
        includeSlot: boolean = true
    )
    {
        this.includeSlot = includeSlot;      
        this.orderId = orderId;
        this.userId = userId;
    }
}