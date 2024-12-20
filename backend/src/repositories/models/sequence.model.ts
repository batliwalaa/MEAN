import { Document } from 'mongoose';
import { Sequence } from '../../models';

export interface SequenceModel extends Sequence, Document {}
