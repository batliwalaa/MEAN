import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { ReviewSummaryModel } from '../models/review-summary.model';

const ReviewSummaryCollection = () => {
    const reviewSummarySchema = new Schema<ReviewSummaryModel>();
    reviewSummarySchema.index({
        productID: 1
    });
    
    return DatabaseConnection().model<ReviewSummaryModel>('ReviewSummaryModel', reviewSummarySchema, 'ReviewSummary');
};

export default ReviewSummaryCollection;
