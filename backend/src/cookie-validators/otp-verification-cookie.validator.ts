import { Injectable } from '../core/decorators';
import { ICookieValidator } from '../models';
import { Request, Response } from 'express';
import Cookies from 'cookies';

@Injectable()
export class OtpVerificationCookieValidator implements ICookieValidator {
    async validateCookie(request: Request, response: Response): Promise<boolean> {
        const cookies = new Cookies(request, response, { secure: true, keys: [process.env.COOKIE_KEY] });
        return await Promise.resolve(request.session.ov === cookies.get('ov'));
    }

    async clear(request: Request, response: Response): Promise<void> {
        const cookies = new Cookies(request, response, { secure: true, keys: [process.env.COOKIE_KEY] });
        delete request.session.ov;

        cookies.set('ov', null, {
            expires: new Date(Date.now() - 10000),
            secure: /true/i.test(process.env.COOKIE_SECURE),
            domain: process.env.COOKIE_DOMAIN,
            sameSite: 'strict',
            httpOnly: /true/i.test(process.env.COOKIE_HTTPONLY),
        });

        await Promise.resolve();
    }
}
