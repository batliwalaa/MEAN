import { Document } from 'mongoose';
import { Session } from '../../models';

export interface SessionModel extends Session, Document {}
