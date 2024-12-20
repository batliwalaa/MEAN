import { Document } from 'mongoose';
import { VehicleSlot } from '../../models';

export interface VehicleSlotModel extends VehicleSlot, Document {}
