import { Schema } from 'mongoose';
import { LoggingItemModel } from '../models/logging-item.model';
import { LoggingConnection } from '../../core/connections';

const LoggingCollection = () => {
    return LoggingConnection().model<LoggingItemModel>('LoggingItemModel', new Schema<LoggingItemModel>(), 'Logging');
};

export default LoggingCollection;
