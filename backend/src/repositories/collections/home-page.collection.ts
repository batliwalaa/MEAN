import { Schema } from 'mongoose';
import { HomePageModel } from '../models/home-page.model';
import { DatabaseConnection } from '../../core/connections';

const HomepageCollection = () => {
    return DatabaseConnection().model<HomePageModel>('HomePageModel', new Schema<HomePageModel>(), 'HomePage');
};

export default HomepageCollection;
