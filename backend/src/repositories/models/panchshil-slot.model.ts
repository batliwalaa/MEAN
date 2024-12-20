import { Document } from 'mongoose';
import { PanchshilSlot } from '../../models';

export interface PanchshilSlotModel extends PanchshilSlot, Document {}
