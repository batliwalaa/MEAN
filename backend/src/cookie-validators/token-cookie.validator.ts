import { Injectable } from '../core/decorators';
import { ICookieValidator } from '../models';
import { Request, Response } from 'express';
import Cookies from 'cookies';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';

@Injectable()
export class TokenCookieValidator implements ICookieValidator {
    async validateCookie(request: Request, response: Response): Promise<boolean> {
        const cookies = new Cookies(request, response, { secure: true, keys: [process.env.COOKIE_KEY] });
        const header = <string>request.headers['authorization'] || '';
        if (header) {
            if (!isEmptyOrWhitespace(header)) {
                const parts = header.split(/\s+/) || [];
                if (Array.isArray(parts) && parts.length === 2 && parts[0].toLowerCase() === 'bearer') {
                    return Promise.resolve(
                        cookies.get('tid') === request.session.tid &&
                            (request.originalUrl.includes('/token/refresh')
                                ? request.session.state.refresh === parts[1]
                                : request.session.state.token === parts[1])
                    );
                }
            }
        }
        return await Promise.resolve(false);
    }

    async clear(request: Request, response: Response): Promise<void> {
        const cookies = new Cookies(request, response, { secure: true, keys: [process.env.COOKIE_KEY] });
        delete request.session.cp;

        cookies.set('tid', null, {
            expires: new Date(Date.now() - 10000),
            secure: /true/i.test(process.env.COOKIE_SECURE),
            domain: process.env.COOKIE_DOMAIN,
            sameSite: 'strict',
            httpOnly: /true/i.test(process.env.COOKIE_HTTPONLY),
        });

        await Promise.resolve();
    }
}
