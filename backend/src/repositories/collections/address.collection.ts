import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { AddressModel } from '../models/address.model';

const AddressCollection = () => {
    return DatabaseConnection().model<AddressModel>('AddressModel', new Schema<AddressModel>(), 'Address');
};

export default AddressCollection;
