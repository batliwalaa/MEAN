import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { ReviewVoteModel } from '../models/review-vote.model';

const ReviewVoteCollection = () => {
    const reviewVoteSchema = new Schema<ReviewVoteModel>();
    reviewVoteSchema.index({
        reviewID: 1
    });
    
    return DatabaseConnection().model<ReviewVoteModel>('ReviewVoteModel', reviewVoteSchema, 'ReviewVote');
};

export default ReviewVoteCollection;
