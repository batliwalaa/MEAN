import { FooterCollection } from './collections';
import { FooterItem } from '../models';
import { Injectable } from '../core/decorators';
import { Model } from 'mongoose';
import { FooterItemModel } from './models/footer-item.model';

@Injectable()
export class FooterRepository {
    private footerCollection: Model<FooterItemModel, any>;

    constructor() {
        this.footerCollection = FooterCollection();
    }

    public async getAll(): Promise<Array<FooterItem>> {
        return await this.footerCollection.find().exec();
    }
}
