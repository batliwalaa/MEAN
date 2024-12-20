import { Schema } from 'mongoose';
import { MenuItemModel } from '../models/menu-item.model';
import { DatabaseConnection } from '../../core/connections';

const MenuCollection = () => {
    return DatabaseConnection().model<MenuItemModel>('MenuItemModel', new Schema<MenuItemModel>(), 'SiteMenu');
};

export default MenuCollection;
