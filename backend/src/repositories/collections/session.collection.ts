import { Schema } from 'mongoose';
import { SessionConnection } from '../../core/connections';
import { SessionModel } from '../models/session.model';

const SessionCollection = () => {
    return SessionConnection().model<SessionModel>('SessionModel', new Schema<SessionModel>(), 'sessions');
};

export default SessionCollection;
