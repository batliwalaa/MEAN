import { Model } from 'mongoose';
import { Injectable } from '../core/decorators';
import { LoggingItemModel } from './models/logging-item.model';
import { LoggingCollection } from './collections';
import { LoggingItem } from '../models';

@Injectable()
export class LoggingRepository {
    private loggingCollection: Model<LoggingItemModel, any>;

    constructor() {
        this.loggingCollection = LoggingCollection();
    }

    public async insertLog(data: Array<LoggingItem>): Promise<void> {
        this.loggingCollection.collection.insertMany(data);
    }
}
