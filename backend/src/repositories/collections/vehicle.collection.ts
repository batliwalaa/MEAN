import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { VehicleModel } from '../models/vehicle.model';

const VehicleModelCollection = () => {
    return DatabaseConnection().model<VehicleModel>('VehicleModel', new Schema<VehicleModel>(), 'Vehicle');
};

export default VehicleModelCollection;
