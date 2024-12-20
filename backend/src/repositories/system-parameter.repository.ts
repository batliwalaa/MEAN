import { SystemParameterCollection } from './collections';
import { SystemParameterModel } from './models/system-parameter.model';
import { Injectable } from '../core/decorators';
import { Model } from 'mongoose';
import { SystemParameter } from '../models';

@Injectable()
export class SystemParameterRepository {
    private systemParameterCollection: Model<SystemParameterModel, any>;

    constructor() {
        this.systemParameterCollection = SystemParameterCollection();
    }

    public async getAll(): Promise<Array<SystemParameter>> {
        return await this.systemParameterCollection.find({}).exec();
    }

    public async getForKey(key: string): Promise<SystemParameter> {
        return await this.systemParameterCollection.collection.findOne({ key });
    }

    public async save(key: string, value: any): Promise<number> {
        const result = await this.systemParameterCollection.collection.updateOne(
            { key },
            { $set: { key, value } },
            { upsert: true }
        );

        return result.upsertedCount;
    }
}
