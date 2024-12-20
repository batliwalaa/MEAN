import { ReviewSummaryCollection } from './collections';
import { ReviewSummaryModel } from './models/review-summary.model';
import { Injectable } from '../core/decorators';
import { Model, Types } from 'mongoose';
import { ProductRating, ReviewSummary } from '../models';

@Injectable()
export class ReviewSummaryRepository {
    private reviewSummaryCollection: Model<ReviewSummaryModel, any>;

    constructor() {
        this.reviewSummaryCollection = ReviewSummaryCollection();
    }

    public async get(id: string): Promise<ReviewSummary> {
        const result = await this.reviewSummaryCollection.findById({ _id: Types.ObjectId(id) }).exec();

        return result._doc ? result._doc : result;
    }

    public async getByProductID(productID: string): Promise<ReviewSummary> {
        const result: any = await this.reviewSummaryCollection.findOne({ productID }).exec();

        return result._doc ? result._doc : result;
    }

    public async save(
        productID: string,
        totalRatings: number,
        avarageRating: number,
        ratingSummary: Array<{ productRating: ProductRating, value: number }>
    ): Promise<void> {
        const result = await this.reviewSummaryCollection.collection.insertOne(
            { productID, totalRatings, avarageRating, ratingSummary },
            { bypassDocumentValidation: true }
        );
    }
}
