import { Document } from 'mongoose';
import { ShoppingCart } from '../../models/shopping-cart';

export interface ShoppingCartModel extends ShoppingCart, Document {}
