import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { StateCodeModel } from '../models/state-code.model';

const StateCodeCollection = () => {
    return DatabaseConnection().model<StateCodeModel>('StateCodeModel', new Schema<StateCodeModel>(), 'StateCode');
};

export default StateCodeCollection;
