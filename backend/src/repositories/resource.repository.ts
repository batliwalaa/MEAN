import { ResourceCollection } from './collections';
import { ResourceModel } from './models/resource.model';
import { Injectable } from '../core/decorators';
import { Model } from 'mongoose';
import { Resource } from '../models';

@Injectable()
export class ResourceRepository {
    private resourceCollection: Model<ResourceModel, any>;

    constructor() {
        this.resourceCollection = ResourceCollection();
    }

    public async get(resourceKey: string, language: string): Promise<Resource> {
        return await this.resourceCollection.findOne({ key: resourceKey, language, deleted: false }).exec();
    }
}
