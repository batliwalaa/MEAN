import { Product } from './product';

export interface ShoppingCartItem extends Product {
    quantity: number;
    dateCreated: Date;
}
