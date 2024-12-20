import JsonSerializerHandlers from '../loaders/api/jsonSerializer';
import { Injectable } from '../core/decorators';
import { UserRepository } from '../repositories';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import { ChangePasswordState, User, VerificationType } from '../models';
import { CryptoService } from './';
import { PubSubChannelKeys } from '../keys/redis-pub-sub-channel.keys';
import { LoginMode } from '../models/enums/login-mode';
import { ProfileChangeProperty } from '../typings/custom';
import { StringConstants } from '../constants/string-constants';

@Injectable()
export class UserService extends BaseService {
    constructor(
        private userRepository: UserRepository,
        private cryptoService: CryptoService,
        redisService: RedisService
    ) {
        super(redisService);
    }

    public async getProfile(id: string): Promise<User> {
        const u = await this.getUserById(id);
        return { _id: u._id, country: u.country, emailId: u.emailId, firstName: u.firstName, lastName: u.lastName, mobile: u.mobile, isoCode: u.isoCode };
    }
    public async getUserById(id: string): Promise<User> {
        const cacheKey = `/user/getuserbyid/:${id}`;

        return await this.execute(cacheKey, 84600, () => this.userRepository.getUserById(id));
    }

    public async getUserByEmail(email: string, active?: boolean): Promise<User> {
        return await this.getByEmail(email, active);
    }

    public async getUserByMobile(isoCode: string, mobile: string, active?: boolean): Promise<User> {
        return await this.getByMobile(isoCode, mobile, active);
    }

    public async createNewAccount(user: User, sessionID: string): Promise<void> {
        await this.userRepository.save(user);
        await this.redisService.publish(
            PubSubChannelKeys.VerificationChannel,
            JSON.stringify({
                sessionID,
                emailId: user.emailId,
                isoCode: user.isoCode,
                mobile: user.mobile,
                type: VerificationType.NewAccountVerify,
            })
        );
    }

    public async sendMobileOtp(
        sessionID: string,
        verificationType: VerificationType,
        isoCode: string,
        mobile: string
    ): Promise<void> {
        await this.redisService.publish(
            PubSubChannelKeys.VerificationChannel,
            JSON.stringify({ sessionID, isoCode, mobile, type: verificationType })
        );
    }

    public async sendEmailOtp(
        sessionID: string,
        verificationType: VerificationType,
        email: string,
        newEmailID?: string
    ): Promise<void> {
        await this.sendEmail(sessionID, verificationType, email, newEmailID);
    }

    public async sendProfileChangeRequestOtp (
        sessionID: string,
        userID: string,
        type: ProfileChangeProperty,
        verificationType: VerificationType
    ): Promise<void> {
        const u = await this.getUserById(userID);

        if (type === 'Mobile') {
            await this.sendMobileOtp(sessionID, verificationType, u.isoCode, u.mobile);
        } else {
            this.sendEmail(sessionID, verificationType, u.emailId);
        }
    }

    public async sendProfileChangeOtp (
        sessionID: string,
        userID: string,
        verificationType: VerificationType,
        profileChangeData: { type: ProfileChangeProperty, value: any, userID: string, isoCode: string }
    ): Promise<void> {
        if (profileChangeData.type === 'Mobile') {
            await this.sendMobileOtp(sessionID, verificationType, profileChangeData.isoCode, profileChangeData.value);
        } else {
            const u = await this.getUserById(userID);
            if (u) {
                this.sendEmail(sessionID, verificationType, u.emailId, profileChangeData.value);
            }            
        }
    }

    public async sendEmail(
        sessionID: string,
        verificationType: VerificationType,
        emailID: string,
        newEmailID?: string
    ): Promise<void> {
        await this.redisService.publish(
            PubSubChannelKeys.VerificationChannel,
            JSON.stringify({ sessionID, emailID, type: verificationType, newEmailID })
        );
    }

    public async getRecoveryDetails(
        mode: LoginMode,
        isoCode: string,
        userName: string
    ): Promise<{ isoCode: string; mobile: string; email: string }> {
        const user =
            mode === LoginMode.Email
                ? await this.getByEmail(userName, true)
                : await this.getByMobile(isoCode, userName, true);

        if (user) {
            return { isoCode: user.isoCode, mobile: user.mobile, email: user.emailId };
        }

        return null;
    }

    public async changePassword(
        mode: LoginMode,
        isoCode: string,
        userName: string,
        password: string
    ): Promise<ChangePasswordState> {
        const user = await this.userRepository.getCurrentAndPreviousPasswordList(mode, isoCode, userName);

        const found = await this.find(password, user.passwords);

        if (!found) {
            const hash = await this.cryptoService.hash(password);
            const result = await this.userRepository.changePassword(user.id, hash);
            return result === 0 ? ChangePasswordState.Failure : ChangePasswordState.Success;
        }
        return ChangePasswordState.PasswordInPreviousSet;
    }

    public async getUsers(): Promise<Array<User>> {
        const cacheKey = `/user/getusers/`;

        return await this.execute(cacheKey, 84600, () => this.userRepository.getAll());
    }

    public async delete(id: string): Promise<void> {
        await this.userRepository.delete(id);
    }

    public async validateSgnIn(mode: LoginMode, isoCode: string, userName: string, password: string): Promise<User> {
        const user =
            mode === LoginMode.Email ? await this.getByEmail(userName) : await this.getByMobile(isoCode, userName);

        // TODO check verification state
        if (user) {
            const valid = await this.cryptoService.compare(password, user.password);
            if (valid) {
                return {
                    _id: user._id,
                    emailId: user.emailId,
                    roles: user.roles,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    country: user.country,
                };
            }
        }

        return null;
    }

    public async changeProfile(
        userID: string,
        type: ProfileChangeProperty,
        value: string
    ): Promise<boolean> {
        const user = await this.getUserById(userID);
        let valid = false;

        if (user) {
            if (user.emailId !== value && user.mobile !== value) {                
                if (type === StringConstants.EMAIL) {
                    await this.userRepository.changeEmail(userID, value);
                } else {
                    await this.userRepository.changeMobile(userID, value);
                }

                valid = true;
            }
        }

        return valid;
    }

    private async getByMobile(isoCode: string, mobile: string, active?: boolean): Promise<User> {
        return await this.get(
            (u) => u.mobile === mobile && u.isoCode === isoCode,
            async () => this.userRepository.getUserByMobile(isoCode, mobile, active)
        );
    }

    private async getByEmail(email: string, active?: boolean): Promise<User> {
        return await this.get(
            (u) => u.emailId.toLowerCase() === email.toLowerCase(),
            async () => this.userRepository.getUserByEmail(email, active)
        );
    }

    private async get(findPredicate: (u: User) => boolean, loader: () => Promise<User>): Promise<User> {
        const cacheKey = '/user/getusers/';
        let user: User;
        const users = (await this.redisService.get<Array<User>>(cacheKey)) || [];
        const ttlInSeconds = 84600;

        if (users) {
            user = users.find(findPredicate);
        }
        if (!user) {
            user = await loader();

            if (user) {
                users.push(user);

                const json: string = JSON.stringify(users, JsonSerializerHandlers);

                if (cacheKey && json) {
                    await this.redisService.set(cacheKey, ttlInSeconds * 5, json);
                }
            }
        }

        return user;
    }

    private async find(password: string, list: Array<string>): Promise<boolean> {
        return new Promise(async (resolve, _) => {
            let found = false;
            for (let i = 0; i < list.length; i++) {
                found = await this.cryptoService.compare(password, list[i]);

                if (found) {
                    break;
                }
            }
            resolve(found);
        });
    }
}
