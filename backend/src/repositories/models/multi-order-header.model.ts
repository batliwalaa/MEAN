import { Document } from 'mongoose';
import { MultiOrderHeader } from '../../models';

export interface MultiOrderHeaderModel extends MultiOrderHeader, Document {}
