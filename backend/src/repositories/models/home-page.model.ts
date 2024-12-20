import { Document } from 'mongoose';
import { HomePage } from '../../models';

export interface HomePageModel extends HomePage, Document {}
