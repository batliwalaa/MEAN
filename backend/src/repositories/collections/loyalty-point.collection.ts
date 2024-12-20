import { Schema } from 'mongoose';
import { LoyaltyPointModel } from '../models/loyalty-point.model';
import { DatabaseConnection } from '../../core/connections';

const LoyaltyPointCollection = () => {
    return DatabaseConnection().model<LoyaltyPointModel>('LoyaltyPointModel', new Schema<LoyaltyPointModel>(), 'LoyaltyPoint');
};

export default LoyaltyPointCollection;
