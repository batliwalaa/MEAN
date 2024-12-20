import { Schema } from 'mongoose';
import { ProductItemModel } from '../models/product-item.model';
import { DatabaseConnection } from '../../core/connections';

const ProductCollection = () => {
    const productSchema = new Schema<ProductItemModel>();
    productSchema.index({
        lob: 'text', type: 'text', subType: 'text', brand: 'text', description: 'text', 'details.title': 'text', 'details.value': 'text'
    });    
    
    productSchema.index({ type: 1, subType: 1, brands: 1, 'details.value': 1 });

    return DatabaseConnection().model<ProductItemModel>('ProductItemModel', productSchema, 'Product');
};

export default ProductCollection;
