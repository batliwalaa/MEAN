import { Schema } from 'mongoose';
import { MultiOrderHeaderModel } from '../models/multi-order-header.model';
import { DatabaseConnection } from '../../core/connections';

const MultiOrderHeaderCollection = () => {
    return DatabaseConnection().model<MultiOrderHeaderModel>(
        'MultiOrderHeaderModel',
        new Schema<MultiOrderHeaderModel>(),
        'MultiOrderHeader');
};

export default MultiOrderHeaderCollection;
