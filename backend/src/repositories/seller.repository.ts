import { Model, Types } from 'mongoose';
import { Injectable } from '../core/decorators';
import { Seller } from '../models';
import SellerCollection from './collections/seller.collection';
import { SellerModel } from './models/seller.model';

@Injectable()
export class SellerRepository {
    private sellerCollection: Model<SellerModel, any>;

    constructor() {
        this.sellerCollection = SellerCollection();
    }

    public async getForCountry(country: string): Promise<Array<Seller>> {
        return await this.sellerCollection.find({ country });
    }

    public async getByID(id: string): Promise<Seller> {
        const r =  await this.sellerCollection.findById({ _id: Types.ObjectId(id) });

        return r && r._doc ? r._doc : r;
    }
}
