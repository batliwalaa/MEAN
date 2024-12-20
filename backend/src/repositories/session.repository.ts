import { SessionCollection } from './collections';
import { SessionModel } from './models/session.model';
import { Injectable } from '../core/decorators';
import { Model } from 'mongoose';
import { Session } from '../models';

@Injectable()
export class SessionRepository {
    private sessionCollection: Model<SessionModel, any>;

    constructor() {
        this.sessionCollection = SessionCollection();
    }

    public async getById(sessionId: string): Promise<Session> {
        const item: Session = await this.sessionCollection.findById(sessionId).exec();

        if (item && item.session) {
            const json = JSON.parse(item.session);
            return { _id: item._id, expires: item.expires, session: json };
        }

        return item;
    }
}
