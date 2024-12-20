import { sign, decode, verify } from 'jsonwebtoken';
import { Injectable } from '../core/decorators';
import { UserTokenRepository } from '../repositories';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import { UserService } from './user.service';
import { UserToken } from '../models/user-token';
import { LoginMode } from '../models/enums/login-mode';
import generateRandomCharacters from '../utils/generate-random-characters';

@Injectable()
export class TokenService extends BaseService {
    private tokensCacheKey: string = '/auth/tokens/';

    constructor(
        private userTokenRepository: UserTokenRepository,
        private userService: UserService,
        redisService: RedisService
    ) {
        super(redisService);
    }

    public async generateJwtToken(mode: LoginMode, isoCode: string, userName: string): Promise<any> {
        await this.revokeToken(userName);

        let user =
            mode === LoginMode.Email
                ? await this.userService.getUserByEmail(userName, true)
                : await this.userService.getUserByMobile(isoCode, userName, true);
        const mobile = user.mobile;
        const emailId = user.emailId;
        user = {
            _id: user._id,
            roles: user.roles,
            firstName: user.firstName,
            lastName: user.lastName,
            country: user.country,
        };
        const options = {
            issuer: this.environment.tokenIssuer,
            audience: this.environment.tokenAudience,
            subject: `${user.firstName} ${user.lastName}`,
        };

        const token = sign(user, process.env.ACCESS_TOKEN_SECRET, {
            ...options,
            algorithm: 'HS512',
            expiresIn: this.environment.tokenExpiresIn,
        });
        const refresh = sign(user, process.env.REFRESH_TOKEN_SECRET, {
            ...options,
            algorithm: 'HS512',
            expiresIn: this.environment.refreshTokenExpiresIn,
        });
        const ut: UserToken = {
            _id: null,
            email: emailId.trim(),
            mobile: mobile.trim(),
            token: token.trim(),
            refresh: refresh.trim(),
            active: true,
            isoCode,
            mode,
        };

        await this.userTokenRepository.save(ut);
        await this.addToken(ut);

        return { token, refresh };
    }

    public async refresh(token: string): Promise<any> {
        const ut = await this.userTokenRepository.findByToken(token);

        if (ut) {
            await this.revokeToken(token);

            return await this.generateJwtToken(ut.mode, ut.isoCode, ut.mode === LoginMode.Email ? ut.email : ut.mobile);
        }

        return null;
    }

    public async IsValidToken(token: string): Promise<boolean> {
        return await this.userTokenRepository.IsValidToken(token);
    }

    public async revokeToken(tokenOrEmailOrMobile: string): Promise<void> {
        await this.removeToken(tokenOrEmailOrMobile);

        await this.userTokenRepository.revoke(tokenOrEmailOrMobile);
    }

    public async decode(token: string): Promise<any> {
        return <string>decode(token, { complete: true });
    }

    public verifyAndValidateToken(token: string): Promise<boolean> {
        const verifyToken = async (token: string, secret: string): Promise<any> => {
            return new Promise((resolve, reject) => {
                verify(token, process.env.ACCESS_TOKEN_SECRET, async (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        const valid = await this.IsValidToken(token);

                        if (!valid) {
                            reject({ name: 'InvalidTokenError', message: 'jwt revoked' });
                        }

                        resolve(true);
                    }
                });
            });
        };

        return new Promise(
            async (resolve, reject): Promise<any> => {
                try {
                    await verifyToken(token, process.env.ACCESS_TOKEN_SECRET);
                    resolve(true);
                } catch (e) {
                    if (e.message === 'invalid signature') {
                        try {
                            await verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
                            resolve(true);
                        } catch {
                            reject();
                        }
                    } else {
                        reject(e);
                    }
                }
            }
        );
    }

    public async generateXsrfToken(): Promise<string> {
        const key = await generateRandomCharacters(10);

        return sign(`${Date.now()}${key}`, process.env.COOKIE_KEY, { algorithm: 'HS512' });
    }

    private async getToken(token: string): Promise<UserToken> {
        const tokens = await this.redisService.get<Array<UserToken>>(this.tokensCacheKey);
        const found =
            Array.isArray(tokens) && token.length > 0
                ? tokens.find((t) => t.token === token || t.refresh === token)
                : null;
        return found;
    }

    private async removeToken(tokenOrEmailOrMobile: string): Promise<void> {
        let tokens = await this.redisService.get<Array<UserToken>>(this.tokensCacheKey);
        const index =
            Array.isArray(tokens) && tokens.length > 0
                ? tokens.findIndex(
                      (t) =>
                          t.token === tokenOrEmailOrMobile ||
                          t.refresh === tokenOrEmailOrMobile ||
                          t.mobile === tokenOrEmailOrMobile ||
                          t.email === tokenOrEmailOrMobile
                  )
                : -1;
        if (index > -1) {
            tokens = tokens.splice(index, -1);

            await this.redisService.set(this.tokensCacheKey, 84600, JSON.stringify(tokens));
        }
    }

    private async addToken(token: UserToken): Promise<void> {
        const tokens = (await this.redisService.get<Array<UserToken>>(this.tokensCacheKey)) || [];

        tokens.push(token);

        await this.redisService.set(this.tokensCacheKey, 84600, JSON.stringify(tokens));
    }
}
