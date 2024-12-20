import { Document } from 'mongoose';
import { Vehicle } from '../../models';

export interface VehicleModel extends Vehicle, Document {}
