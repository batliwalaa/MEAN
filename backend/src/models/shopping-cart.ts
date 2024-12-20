import { DeliverySlotType } from './enums/delivery-slot-type';
import { ShoppingCartItem } from './shopping-cart-item';

export interface ShoppingCart {
    _id: any;
    sessionID?: string;
    userID?: string;
    items: Array<ShoppingCartItem>;
    dateCreated: number;
    test?: boolean;
    slotID?: string;
    slotType?: DeliverySlotType;
    deleted: boolean;
    paymentInProgress: boolean;
}
