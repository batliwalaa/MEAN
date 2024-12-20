import { Document } from 'mongoose';
import { Review } from '../../models';

export interface ReviewModel extends Review, Document {}
