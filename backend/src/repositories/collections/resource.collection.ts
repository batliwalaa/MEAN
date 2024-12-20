import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { ResourceModel } from '../models/resource.model';

const ResourceCollection = () => {
    return DatabaseConnection().model<ResourceModel>('ResourceModel', new Schema<ResourceModel>(), 'Resource');
};

export default ResourceCollection;
