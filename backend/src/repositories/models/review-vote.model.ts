import { Document } from 'mongoose';
import { ReviewVote } from '../../models';

export interface ReviewVoteModel extends ReviewVote, Document {
}