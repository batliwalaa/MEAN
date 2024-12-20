import { Schema } from 'mongoose';
import { FooterItemModel } from '../models/footer-item.model';
import { DatabaseConnection } from '../../core/connections';

const FooterCollection = () => {
    return DatabaseConnection().model<FooterItemModel>('FooterItemModel', new Schema<FooterItemModel>(), 'SiteFooter');
};

export default FooterCollection;
