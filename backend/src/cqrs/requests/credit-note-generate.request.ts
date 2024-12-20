import { Injectable } from '../../core/decorators';
import { IRequest } from '../../core/mediator/request';

@Injectable()
export class CreditNoteGenerateRequest implements IRequest<void> {
    readonly orderID: string;
    readonly userID: string;

    constructor (orderID: string, userID: string) {
        this.orderID = orderID;
        this.userID = userID;
    }
}