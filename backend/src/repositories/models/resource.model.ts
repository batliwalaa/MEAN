import { Document } from 'mongoose';
import { Resource } from '../../models';

export interface ResourceModel extends Resource, Document {}
