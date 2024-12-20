import { Document } from 'mongoose';
import { Order } from '../../models';

export interface OrderModel extends Order, Document {}
