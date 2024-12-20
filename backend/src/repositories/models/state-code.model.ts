import { Document } from 'mongoose';
import { StateCode } from '../../models';

export interface StateCodeModel extends StateCode, Document {}
