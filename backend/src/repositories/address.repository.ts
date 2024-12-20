import { Model, Types } from 'mongoose';
import { Injectable } from '../core/decorators';
import { Address } from '../models';
import AddressCollection from './collections/address.collection';
import { AddressModel } from './models/address.model';

@Injectable()
export class AddressRepository {
    private addressCollection: Model<AddressModel, any>;

    constructor() {
        this.addressCollection = AddressCollection();
    }

    public async getForUser(userID: string): Promise<Array<Address>> {
        return await this.addressCollection.find({ userID: userID });
    }

    public async get(id: string): Promise<Address> {
        const result = await this.addressCollection.findById({ _id: Types.ObjectId(id) }).exec();
        return result._doc ? result._doc : result;
    }

    public async save(address: Address): Promise<string> {
        if(address.isDefaultAddress === true){
            await this.addressCollection.collection.updateOne(
                { userID: address.userID },
                { $set: {isDefaultAddress: false} },
                { bypassDocumentValidation: true }
            );
        }
        if (!address._id) {
            const r = await this.addressCollection.collection.insertOne(address, { bypassDocumentValidation: true });
            return  r && r.insertedId ? r.insertedId.toString() : null;
        } else {
            const data = { ...address };
            delete data._id
            const r = await this.addressCollection.collection.updateOne(
                { _id: Types.ObjectId(address._id) },
                { $set: data },
                { bypassDocumentValidation: true }
            );
        }       
    }

    public async delete(id: string): Promise<void> {
        await this.addressCollection.collection.deleteOne({ _id: Types.ObjectId(id) }, { bypassDocumentValidation: true });
    }
}
