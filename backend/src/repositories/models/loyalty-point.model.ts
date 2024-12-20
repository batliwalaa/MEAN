import { Document } from 'mongoose';
import { LoyaltyPoint } from '../../models';

export interface LoyaltyPointModel extends LoyaltyPoint, Document {}
