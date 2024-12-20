import { IRequest } from "../../core/mediator/request";
import { Seller } from "../../models";

export class GetSellerByIdRequest implements IRequest<Seller> {
    readonly sellerID: string;

    constructor(sellerID: string) {
        this.sellerID = sellerID;
    }
}
