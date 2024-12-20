import { IRequest } from "../../core/mediator/request";
import { OrderListResponse } from '..';

export class OrderListRequest implements IRequest<OrderListResponse> {
    readonly pn: number;  
    readonly includeSlots: boolean;
    readonly userId: string;
    readonly searchMap: any;


    constructor(
        pn: number,
        userId: string,       
        searchMap: any,
        includeSlots: boolean = true
    )
    {
        this.pn = pn;
        this.userId = userId;
        this.includeSlots = includeSlots;
        this.searchMap = searchMap;
    }    
}

