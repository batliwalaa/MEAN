import { Injectable } from '../../core/decorators';
import { IRequest } from '../../core/mediator/request';

@Injectable()
export class InvoiceGenerateRequest implements IRequest<void> {
    readonly orderID: string
    readonly userID: string;

    constructor(userID: string, orderID: string) {
        this.orderID = orderID;
        this.userID = userID;
    }
}