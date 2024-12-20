import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { VehicleSlotModel } from '../models/vehicle-slot.model';

const VehicleSlotCollection = () => {
    return DatabaseConnection().model<VehicleSlotModel>(
        'VehicleSlotModel',
        new Schema<VehicleSlotModel>(),
        'VehicleSlot'
    );
};

export default VehicleSlotCollection;
