import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { SellerModel } from '../models/seller.model';

const SellerCollection = () => {
    return DatabaseConnection().model<SellerModel>('SellerModel', new Schema<SellerModel>(), 'Seller');
};

export default SellerCollection;
