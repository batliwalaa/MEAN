import { ShoppingCartCollection } from './collections';
import { ShoppingCartModel } from './models/shopping-cart.model';
import { Injectable } from '../core/decorators';
import { Model, Types } from 'mongoose';
import { DeliverySlotType, ShoppingCart, ShoppingCartItem } from '../models';

@Injectable()
export class ShoppingCartRepository {
    private shoppingCartCollection: Model<ShoppingCartModel, any>;

    constructor() {
        this.shoppingCartCollection = ShoppingCartCollection();
    }

    public async getBySessionID(sessionID: string): Promise<ShoppingCart> {
        return await this.shoppingCartCollection.findOne({ sessionID, deleted: false, paymentInProgress: false }).exec();
    }

    public async getByUserID(userID: string): Promise<ShoppingCart> {
        return await this.shoppingCartCollection.findOne({ userID, deleted: false, paymentInProgress: false }).exec();
    }

    public async getByID(id: string): Promise<ShoppingCart> {
        return await this.shoppingCartCollection.findOne({ _id: Types.ObjectId(id) }).exec();
    }

    public async create(sessionID: string, userID?: string): Promise<ShoppingCart> {
        const items = new Array<ShoppingCartItem>();
        const cart: ShoppingCart = { _id: null, sessionID, userID, items, dateCreated: Date.now(), deleted: false, paymentInProgress: false };
        const response = await this.shoppingCartCollection.collection.insertOne(cart, {
            bypassDocumentValidation: true,
        });

        cart._id = <any>response.insertedId.toString();

        return cart;
    }

    public async update(cart: ShoppingCart): Promise<void> {
        await this.shoppingCartCollection.collection.updateMany(
            { sessionID: cart.sessionID },
            { $set: { items: cart.items } }
        );
    }

    public async updateSlot(shoppingCartID: string, slotID: string, slotType: DeliverySlotType): Promise<void> {
        await this.shoppingCartCollection.collection.updateOne(
            { _id: Types.ObjectId(shoppingCartID) },
            { $set: { slotID, slotType } },
            { bypassDocumentValidation: true }
        );
    }

    public async updateSessionID(shoppingCartID: string, sessionID: string): Promise<void> {
        await this.shoppingCartCollection.collection.updateOne(
            { _id: Types.ObjectId(shoppingCartID) },
            { $set: { sessionID } },
            { bypassDocumentValidation: true }
        );
    }

    public async delete(shoppingCartID: string, userID: string): Promise<void> {
        await this.shoppingCartCollection.collection.updateOne(
            { _id: Types.ObjectId(shoppingCartID) },
            { $set: { deleted: true, modifiedBy: userID, modifiedDate: new Date() } },
            { bypassDocumentValidation: true }
        );
    }

    public async setPaymentInProgress(shoppingCartID: string, userID: string, status: boolean = true): Promise<void> {
        await this.shoppingCartCollection.collection.updateOne(
            { _id: Types.ObjectId(shoppingCartID) },
            { $set: { paymentInProgress: status, modifiedBy: userID, modifiedDate: new Date() } },
            { bypassDocumentValidation: true }
        );
    }
}
