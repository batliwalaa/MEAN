import { MenuCollection } from './collections';
import { MenuItemModel } from './models/menu-item.model';
import { Injectable } from '../core/decorators';
import { Model } from 'mongoose';
import { MenuItem } from '../models';

@Injectable()
export class MenuRepository {
    private menuCollection: Model<MenuItemModel, any>;

    constructor() {
        this.menuCollection = MenuCollection();
    }

    public async getAll(): Promise<Array<MenuItem>> {
        return await this.menuCollection.find().exec();
    }
}
