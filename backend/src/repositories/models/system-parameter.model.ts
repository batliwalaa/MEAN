import { Document } from 'mongoose';
import { SystemParameter } from '../../models';

export interface SystemParameterModel extends SystemParameter, Document {}
