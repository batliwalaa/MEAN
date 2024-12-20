import { Document } from 'mongoose';
import { OrderRouteDetail } from '../../models';

export interface OrderRouteDetailModel extends OrderRouteDetail, Document {}
