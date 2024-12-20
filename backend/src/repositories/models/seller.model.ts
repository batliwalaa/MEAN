import { Document } from 'mongoose';
import { Seller } from '../../models';

export interface SellerModel extends Seller, Document {}
