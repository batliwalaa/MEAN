import { Schema } from 'mongoose';
import { UserModel } from '../models/user.model';
import { DatabaseConnection } from '../../core/connections';

const UserCollection = () => {
    return DatabaseConnection().model<UserModel>('UserModel', new Schema<UserModel>(), 'User');
};

export default UserCollection;
