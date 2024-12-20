import { PaymentCompleteResponse } from "..";
import { IRequest } from "../../core/mediator/request";
import { PaymentResponse } from "../../models";

export class PaymentCompleteRequest implements IRequest<PaymentCompleteResponse> {
    readonly orderID: string;
    readonly userID: string;
    readonly shoppingCartID: string;
    readonly orderNumber: string;
    readonly paymentResponse: PaymentResponse

    constructor(
        orderID: string,
        userID: string,
        shoppingCartID: string,
        orderNumber: string,
        paymentResponse: PaymentResponse
    ) {
        this.orderID = orderID;
        this.userID = userID;
        this.shoppingCartID = shoppingCartID;
        this.orderNumber = orderNumber;
        this.paymentResponse = paymentResponse;
    }
}
