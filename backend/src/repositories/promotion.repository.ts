import { Model, Types } from 'mongoose';
import { Injectable } from '../core/decorators';
import { Promotion } from '../models';
import PromotionCollection from './collections/promotion.collection';
import { PromotionModel } from './models/promotion.model';

@Injectable()
export class PromotionRepository {
    private promotionCollection: Model<PromotionModel, any>;

    constructor() {
        this.promotionCollection = PromotionCollection();
    }

    public async getAll(): Promise<Array<Promotion>> {
        return await this.promotionCollection.find({ }).exec();
    }

    public async getCurrentPromotions(): Promise<Array<Promotion>> {
        const now = Date.now();

        return await this.promotionCollection.find({ $and: [ { from: { $gte: now } }, { to: { $lte: now }}, { active: true }] }).exec();
    }

    public async save(promotion: Promotion): Promise<string> {
        const options = await this.promotionCollection.collection.insertOne(promotion, { bypassDocumentValidation: true });

        return options.insertedId.toString();
    }

    public async setActiveState(id: string, active: boolean = true): Promise<void> {
        await this.promotionCollection.collection.updateOne(
            { _id: Types.ObjectId(id) },
            { $set: { active } },
            { bypassDocumentValidation: true }
        );
    }

    public async delete(id: string): Promise<void> {
        await this.promotionCollection.collection.deleteOne({ _id: id }, { bypassDocumentValidation: true });
    }
}
