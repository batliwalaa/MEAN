import { HomepageCollection } from './collections';
import { HomePageModel } from './models/home-page.model';
import { Injectable } from '../core/decorators';
import { Model } from 'mongoose';
import { HomePage } from '../models';

@Injectable()
export class HomePageRepository {
    private homepageCollection: Model<HomePageModel, any>;

    constructor() {
        this.homepageCollection = HomepageCollection();
    }

    public async get(key: string): Promise<HomePage> {
        return await this.homepageCollection.findOne({ name: key }).exec();
    }
}
