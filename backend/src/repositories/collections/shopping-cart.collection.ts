import { Schema } from 'mongoose';
import { ShoppingCartModel } from '../models/shopping-cart.model';
import { DatabaseConnection } from '../../core/connections';

const ShoppingCartCollection = () => {
    return DatabaseConnection().model<ShoppingCartModel>(
        'ShoppingCartModel',
        new Schema<ShoppingCartModel>(),
        'ShoppingCart'
    );
};

export default ShoppingCartCollection;
