import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { ReviewModel } from '../models/review.model';

const ReviewCollection = () => {
    const reviewSchema = new Schema<ReviewModel>();
    reviewSchema.index({
        productID: 1
    });
    
    return DatabaseConnection().model<ReviewModel>('ReviewModel', reviewSchema, 'Review');
};

export default ReviewCollection;
