import { ShoppingCartItem } from './shopping-cart-item';

export interface ShoppingCart {
    _id: string;
    sessionID?: string;
    userID?: string;
    items: Array<ShoppingCartItem>;
}
