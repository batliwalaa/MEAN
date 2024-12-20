import { ShoppingCartItem } from "./shopping-cart-item";

export interface OrderItem extends ShoppingCartItem {
    returned?: boolean;
    returnedQuantity?: number;
    discountAmount?: number;
}