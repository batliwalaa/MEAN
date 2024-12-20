import { Document } from 'mongoose';
import { Promotion } from '../../models';

export interface PromotionModel extends Promotion, Document {}
