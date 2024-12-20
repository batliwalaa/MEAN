import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { PanchshilSlotModel } from '../models/panchshil-slot.model';

const PanchshilSlotCollection = () => {
    return DatabaseConnection().model<PanchshilSlotModel>(
        'PanchshilSlotModel',
        new Schema<PanchshilSlotModel>(),
        'PanchshilSlot'
    );
};

export default PanchshilSlotCollection;
