import { ShoppingCartItem } from './shopping-cart-item';

export interface ShoppingCartItemGroup {
    key: string;
    items: Array<ShoppingCartItem>;
}
