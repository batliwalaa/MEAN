import { Schema } from 'mongoose';
import { DatabaseConnection } from '../../core/connections';
import { UserTokenModel } from '../models/user-token.model';

const UserTokenCollection = () => {
    return DatabaseConnection().model<UserTokenModel>('UserTokenModel', new Schema<UserTokenModel>(), 'UserToken');
};

export default UserTokenCollection;
