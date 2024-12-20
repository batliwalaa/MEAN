import { Document } from 'mongoose';
import { Product } from '../../models/product';
export interface ProductItemModel extends Product, Document {}
