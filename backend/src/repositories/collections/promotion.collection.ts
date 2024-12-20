import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { PromotionModel } from '../models/promotion.model';

const PromotionModelCollection = () => {
    return DatabaseConnection().model<PromotionModel>('PromotionModel', new Schema<PromotionModel>(), 'Promotion');
};

export default PromotionModelCollection;
