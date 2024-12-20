import { UserCollection } from './collections';
import { User } from '../models/user';
import { Injectable } from '../core/decorators';
import { Model, Types } from 'mongoose';
import { UserModel } from './models/user.model';
import { Logger } from '../core/structured-logging/logger';
import { Logging } from '../core/structured-logging/log-manager';
import { LoginMode } from '../models/enums/login-mode';

@Injectable()
export class UserRepository {
    private userCollection: Model<UserModel, any>;
    private logger: Logger;

    constructor() {
        this.userCollection = UserCollection();
        this.logger = Logging.getLogger(`${this.constructor.name}`);
    }

    public async save(user: User): Promise<string> {
        const options = await this.userCollection.collection.insertOne(user, { bypassDocumentValidation: true });

        return options.insertedId.toString();
    }

    public async getAll(active: boolean = true): Promise<Array<User>> {
        return await this.search(active);
    }

    public async getUserByEmail(email: string, active?: boolean): Promise<User> {
        const users = await this.search(active, email);

        if (Array.isArray(users) && users.length > 1) {
            this.logger.error(`FATAL Error: Multiple duplicate users: ${email}`, { action: 'getUserByEmail'});
            return users[0].toObject();
        } else {
            return users && users.length === 1 ? users[0].toObject() : null;
        }
    }

    public async getUserByMobile(isoCode: string, mobile: string, active?: boolean): Promise<User> {
        const users = await this.search(active, mobile, isoCode);

        if (Array.isArray(users) && users.length > 1) {
            this.logger.error(`FATAL Error: Multiple duplicate users: ${isoCode}${mobile}`, { action: 'getUserByMobile'});
            return users[0].toObject();
        } else {
            return users && users.length === 1 ? users[0].toObject() : null;
        }
    }

    public async getUserById(id: string): Promise<User> {
        const r = await this.userCollection.collection.findOne({ _id: Types.ObjectId(id) });

        return r && r._doc ? r._doc : r;
    }

    public async delete(id: string): Promise<void> {
        await this.userCollection.findByIdAndUpdate(id, { active: false });
    }

    public async setEmailVerified(
        emailId: string,
        emailVerified: boolean = true,
        active: boolean = true
    ): Promise<void> {
        await this.userCollection.collection.updateOne(
            { emailId: emailId },
            { $set: { emailVerified: emailVerified, active: active } },
            { bypassDocumentValidation: true }
        );
    }

    public async setMobileVerified(
        isoCode: string,
        mobile: string,
        mobileVerified: boolean = true,
        active: boolean = true
    ): Promise<void> {
        await this.userCollection.collection.updateOne(
            { isoCode: isoCode, mobile: mobile },
            { $set: { mobileVerified: mobileVerified, active: active } },
            { bypassDocumentValidation: true }
        );
    }

    public async getCurrentAndPreviousPasswordList(
        mode: LoginMode,
        isoCode: string,
        userName: string
    ): Promise<{ passwords: Array<string>; id: string }> {
        const query: any = { $and: [] };

        if (mode === LoginMode.Email) {
            query['$and'].push({ emailId: userName });
        } else {
            query['$and'].push({ isoCode });
            query['$and'].push({ mobile: userName });
        }

        let passwords = new Array<string>();
        const result = await this.userCollection.findOne(query, 'password previousPasswords');

        passwords = new Array<string>();
        passwords.push(result._doc.password);

        if (Array.isArray(result._doc.previousPasswords)) {
            passwords = passwords.concat(result._doc.previousPasswords.reverse().slice(0, 2));
        }

        return { passwords, id: result._doc._id };
    }

    public async changePassword(id: any, hash: string): Promise<number> {
        const user = await this.userCollection.findById(id);

        const result = await this.userCollection.collection.updateOne(
            { _id: id },
            { $set: { password: hash, active: true }, $push: { previousPasswords: user._doc.password } },
            { bypassDocumentValidation: true }
        );

        return result.modifiedCount;
    }

    public async changeMobile(id: any, value: string): Promise<number> {
        const user = await this.userCollection.findById(id);

        const result = await this.userCollection.collection.updateOne(
            { _id: Types.ObjectId(id) },
            { $set: { mobile: value, active: true, mobileVerified: false }},
            { bypassDocumentValidation: true }
        );

        return result.modifiedCount;
    }

    public async changeEmail(id: any, value: string): Promise<number> {
        const user = await this.userCollection.findById(id);

        const result = await this.userCollection.collection.updateOne(
            { _id: Types.ObjectId(id) },
            { $set: { emailId: value, active: true, emailVerified: false }},
            { bypassDocumentValidation: true }
        );

        return result.modifiedCount;
    }

    private async search(active?: boolean, userName?: string, isoCode?: string): Promise<Array<any>> {
        let queryObject: any = { $and: [] };

        if (active !== null && active !== undefined) {
            queryObject['$and'].push({ active });
        }

        if (userName) {
            queryObject['$and'].push({
                $or: [
                    { emailId: new RegExp(`\\b${userName}\\b`, 'i') },
                    { mobile: new RegExp(`\\b${userName}\\b`, 'i') },
                ],
            });
        }

        if (isoCode) {
            queryObject['$and'].push({ isoCode });
        }

        let query = this.userCollection.find(queryObject);

        return await query.exec();
    }
}
