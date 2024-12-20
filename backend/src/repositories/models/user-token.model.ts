import { Document } from 'mongoose';
import { UserToken } from '../../models/user-token';

export interface UserTokenModel extends UserToken, Document {}
