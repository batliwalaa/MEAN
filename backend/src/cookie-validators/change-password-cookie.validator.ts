import { Injectable } from '../core/decorators';
import { ICookieValidator } from '../models';
import { Request, Response } from 'express';
import Cookies from 'cookies';

@Injectable()
export class ChangePasswordCookieValidator implements ICookieValidator {
    async validateCookie(request: Request, response: Response): Promise<boolean> {
        const cookies = new Cookies(request, response, { secure: true, keys: [process.env.COOKIE_KEY] });
        return await Promise.resolve(request.session.cp === cookies.get('cp'));
    }

    async clear(request: Request, response: Response): Promise<void> {
        const cookies = new Cookies(request, response, { secure: true, keys: [process.env.COOKIE_KEY] });
        delete request.session.cp;

        cookies.set('cp', null, {
            expires: new Date(Date.now() - 10000),
            secure: /true/i.test(process.env.COOKIE_SECURE),
            domain: process.env.COOKIE_DOMAIN,
            sameSite: 'strict',
            httpOnly: /true/i.test(process.env.COOKIE_HTTPONLY),
        });

        await Promise.resolve();
    }
}
