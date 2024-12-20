import { UserTokenCollection } from './collections';
import { Injectable } from '../core/decorators';
import { Model } from 'mongoose';
import { UserTokenModel } from './models/user-token.model';
import { UserToken } from '../models/user-token';

@Injectable()
export class UserTokenRepository {
    private userTokenCollection: Model<UserTokenModel, any>;

    constructor() {
        this.userTokenCollection = UserTokenCollection();
    }

    public async save(userToken: UserToken): Promise<void> {
        await this.userTokenCollection.collection.insertMany([userToken], { ordered: false });
    }

    public async find(emailOrMobile: string, isoCode?: string): Promise<void> {
        const query: any = {
            $and: [{ active: true }, { $or: [{ email: emailOrMobile }, { mobile: emailOrMobile }] }],
        };

        if (isoCode) {
            query['$and'].push({ isoCode: isoCode });
        }

        await this.userTokenCollection.findOne(query);
    }

    public async findByToken(token: string): Promise<UserToken> {
        return await this.userTokenCollection.findOne({
            $and: [{ active: true }, { $or: [{ token: token }, { refresh: token }] }],
        });
    }

    public async IsValidToken(token: string): Promise<boolean> {
        return !!(await this.findByToken(token));
    }

    public async revoke(tokenOrEmailOrMobile: string): Promise<void> {
        await this.userTokenCollection.collection.updateOne(
            {
                $or: [
                    { token: tokenOrEmailOrMobile },
                    { refresh: tokenOrEmailOrMobile },
                    { email: tokenOrEmailOrMobile },
                    { mobile: tokenOrEmailOrMobile },
                ],
            },
            { $set: { active: false } },
            { bypassDocumentValidation: true }
        );
    }
}
