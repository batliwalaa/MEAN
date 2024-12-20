import { ReviewCollection } from './collections';
import { ReviewModel } from './models/review.model';
import { Injectable } from '../core/decorators';
import { Model, Types } from 'mongoose';
import { Result, Review } from '../models';
import { ReviewVoteModel } from './models/review-vote.model';
import ReviewVoteCollection from './collections/review-vote.collection';
import { Lock } from '../core/lock/lock';
import { LikeDislikeVote } from '../models/like-dislike-vote';

@Injectable()
export class ReviewRepository {
    private pageSize: number;
    private readonly reviewCollection: Model<ReviewModel, any>;
    private readonly reviewVoteCollection: Model<ReviewVoteModel, any>;
    
    constructor (
        private lock: Lock
    ) {
        this.reviewCollection = ReviewCollection();
        this.reviewVoteCollection = ReviewVoteCollection();
    }

    public async get(id: string): Promise<Review> {
        const result = await this.reviewCollection.findById({ _id: Types.ObjectId(id) }).exec();

        return result._doc ? result._doc : result;
    }

    public async getByProductID(productID: string, pageNumber: number = 1, processed?: boolean, limit?: number): Promise<Result<Review>> {
        const query: any = { productID };

        if (processed) {
            query['processed'] = processed;
        }
        const count = await this.getCount(query);
        let queryObject = this.reviewCollection.find(query);
        
        if (limit) {
            queryObject = queryObject.skip((pageNumber - 1) * Number(limit)).limit(limit);
        }

        const result: Array<any> = await queryObject.sort({ modifiedDate: -1}).exec();

        return { count, items: result.map(r => r._doc ? r._doc : r) };
    }

    public async getUnprocessed(): Promise<Array<Review>> {
        const result: Array<any> = await this.reviewCollection.find({ processed: false }).exec();

        return result.map(r => r._doc ? r._doc : r);
    }

    public async setProcessed(): Promise<void> {
        await this.reviewCollection.collection.updateMany(
            { processed: false },
            { $set: { processed: true } }
        );
    }

    public async save(userID: string, review: Review): Promise<Review> {
        const now = Date.now();
        let reviewItem: Review;

        if (!review._id) {
            reviewItem = { 
                ...review,
                createdBy: userID,
                createdDate: now,
                modifiedBy: userID,
                modifiedDate: now,
                processed: false,
                votes: { likeVote: 0, dislikeVote: 0 }
            };
            /* result = await this.reviewCollection.collection.insertOne(
                reviewItem,
                { bypassDocumentValidation: true }
            ); */
        } else  {
            reviewItem = { 
                ...review,
                modifiedBy: userID,
                modifiedDate: now,
                processed: false,
                votes: { likeVote: 0, dislikeVote: 0 }
            }
        }

        delete reviewItem._id;
        
        const result = await this.reviewCollection.collection.updateOne(
            { _id: Types.ObjectId(review._id) },
            { $set: reviewItem },
            { upsert: true, bypassDocumentValidation: true }
        );

        if (result.upsertedCount === 1) {
            return await this.get(result.upsertedId._id.toString());
        } else if (result.modifiedCount === 1) {
            return await this.get(review._id.toString());
        } else {
            throw new Error(`Failed to save review for order: ${review.orderID}, product: ${review.productID}`);
        }        
    }

    public async updateVotes(reviewID: string, vote: LikeDislikeVote, ipAddress: string): Promise<void> {
        const today = new Date();
        try {
            await this.lock.acquire(`reviewVote-${reviewID}`);

            const review = await this.get(reviewID);

            if (!review.votes) {
                review.votes = { likeVote: 0, dislikeVote: 0 };
            }

            if (vote.likeVote) {
                review.votes.likeVote += 1;
            }

            if (vote.dislikeVote) {
                review.votes.dislikeVote += 1;
            } 

            await this.reviewCollection.collection.updateOne(
                { _id: Types.ObjectId(reviewID) }, 
                { $set: { votes: review.votes } },
                { bypassDocumentValidation: true }
            );

            await this.lock.release(`reviewVote-${reviewID}`);

            await this.reviewVoteCollection.collection.insertOne({
                id: null,
                reviewID,
                ipAddress,
                likeVote: vote.likeVote,
                dislikeVote: vote.dislikeVote,
                dateCreated: today
            });

        } catch (e) {
            await this.lock.release(`reviewVote-${reviewID}`);
            throw e;
        }
    }

    public async getUserReviewByOrderAndProduct(userID: string, orderID: string, productID: string): Promise<Review> {
        const query: any = { createdBy: userID, orderID, productID };
        let result = await this.reviewCollection.findOne(query).exec();

        if (!result) {
            result = await this.save(userID, { _id: null, productID, orderID, headline: '', review: '', rating: 0,featuresRating: [], user: ``,urls: [],processed: false });
        }
        
        return  result && result._doc || result;
    }

    public async getUserReviewByOrder(userID: string, orderID: string): Promise<Array<Review>> {
        const query: any = { createdBy: userID, orderID};
        const result = await this.reviewCollection.find(query).exec();
        
        return result && result._doc || result;
    }

    private async getCount(query: any): Promise<number> {
        const aggregation: Array<any> = [];

        aggregation.push({ $match: query });
        aggregation.push({ $count: 'records' });

        const result = await this.reviewCollection.aggregate(aggregation).exec();

        return Array.isArray(result) && result.length === 1 ? result[0].records : 0;
    }
}
