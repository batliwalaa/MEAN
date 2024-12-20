import { Document } from 'mongoose';
import { ReviewSummary } from '../../models';

export interface ReviewSummaryModel extends ReviewSummary, Document {}
