import { Document } from 'mongoose';
import { LoggingItem } from '../../models';

export interface LoggingItemModel extends LoggingItem, Document {}
