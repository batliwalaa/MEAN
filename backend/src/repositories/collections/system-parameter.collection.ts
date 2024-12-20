import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { SystemParameterModel } from '../models/system-parameter.model';

const SystemParameterCollection = () => {
    return DatabaseConnection().model<SystemParameterModel>(
        'SystemParameterModel',
        new Schema<SystemParameterModel>(),
        'SystemParameter'
    );
};

export default SystemParameterCollection;
