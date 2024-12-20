import { IRequest } from "../../core/mediator/request";

export class CreateOrderRequest implements IRequest<{
    id?: string,
    amount?: number,
    orderNumber?: string,
    isMultiOrder?: boolean,
    valid?: boolean,
    availablePoints?: number;
    pointsToredeem?: number;
}> {
    readonly addressID: string;
    readonly amount: string;
    readonly promotions: Array<string>;
    readonly pointsToRedeem: number;
    readonly userID: string;
    readonly shoppingCartID: string;
    readonly sessionID: string;

    constructor(
        addressID: string,
        amount: string,
        promotions: Array<string>,
        pointsToRedeem: number,
        userID: string,
        shoppingCartID: string,
        sessionID: string
    ) {
        this.addressID = addressID;
        this.amount = amount;
        this.promotions = promotions;
        this.pointsToRedeem = pointsToRedeem
        this.userID = userID;
        this.shoppingCartID = shoppingCartID;
        this.sessionID = sessionID;
    }
}
