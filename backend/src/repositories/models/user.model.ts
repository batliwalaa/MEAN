import { Document } from 'mongoose';
import { User } from '../../models/user';

export interface UserModel extends User, Document {}
