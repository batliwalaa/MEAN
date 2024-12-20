import { verify } from 'jsonwebtoken';
import { getRequest, getResponse } from '../utils';
import { HttpStatusCode } from '../http.status.code';
import { User } from '../../models/user';
import { TokenService } from '../../services';
import { Injector } from '../di/injector';

export const Authorize = (roles?: Array<string>): MethodDecorator => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
        const originalMethod = descriptor.value;
        const originalTarget = target;
        const verifyToken = (token: string, secret: string): Promise<any> => {
            return new Promise(async (resolve, reject) => {
                verify(token, secret, async (err, user: User) => {
                    if (err) {
                        reject(err);
                    } else {
                        const tokenService = Injector.resolve<TokenService>(TokenService);
                        const valid = await tokenService.IsValidToken(token);

                        if (!valid) {
                            reject({ name: 'InvalidTokenError', message: 'jwt revoked' });
                        }
                        const hasAccess =
                            !Array.isArray(roles) ||
                            roles.length === 0 ||
                            roles.find((r) => user.roles.includes(r)) !== null;

                        if (!hasAccess) {
                            reject({ name: 'NoAccessError', message: 'invalid role' });
                        }

                        resolve(user);
                    }
                });
            });
        };

        descriptor.value = async function (...args: any) {
            const request = getRequest(args);
            const response = getResponse(args);
            const authHeader = request.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            const secret = request.originalUrl.includes('/token/refresh')
                ? process.env.REFRESH_TOKEN_SECRET
                : process.env.ACCESS_TOKEN_SECRET;
            if (token === null) {
                return response.sendStatus(HttpStatusCode.Unauthorized);
            }

            let user: User = null;
            try {
                user = await verifyToken(token, secret);
                originalTarget['_user'] = user;
                await originalMethod.apply(this, args);
            } catch (e) {
                if (e.message === 'invalid signature' && request.originalUrl.includes('/token/revoke')) {
                    try {
                        user = await verifyToken(token, process.env.REFRESH_TOKEN_SECRET);
                        originalTarget['_user'] = user;
                        await originalMethod.apply(this, args);
                    } catch (err) {
                        if (e.message === 'invalid role') {
                            response.status(HttpStatusCode.BadRequest);
                            response.send({ name: 'InvalidRequestError', message: 'Invalid credentials' });
                        } else {
                            response.status(HttpStatusCode.Unauthorized);
                            response.send(err);
                        }
                    }
                } else if (e.message === 'invalid role') {
                    response.status(HttpStatusCode.BadRequest);
                    response.send({ name: 'InvalidRequestError', message: 'Invalid credentials' });
                } else {
                    response.status(HttpStatusCode.Unauthorized);
                    response.send(e);
                }
            }
        };

        return descriptor;
    };
};
