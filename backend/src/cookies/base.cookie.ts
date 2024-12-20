import { Request, Response } from 'express';
import { Injector } from '../core/di/injector';
import { CryptoService } from '../services';
import Cookies from 'cookies';

export abstract class BaseCookie {
    protected async cookie(
        name: string,
        maxAge: number,
        request: Request,
        response: Response,
        content: any
    ): Promise<void> {
        const cryptoService = Injector.resolve<CryptoService>(CryptoService);
        const hash = await cryptoService.hash(JSON.stringify({ ...content, sessionID: request.sessionID }));
        const cookies = new Cookies(request, response, { secure: true, keys: [process.env.COOKIE_KEY] });

        request.session.state = {...request.session.state, ...content };
        request.session[name] = hash;

        cookies.set(name, hash, {
            maxAge: maxAge,
            secure: /true/i.test(process.env.COOKIE_SECURE),
            domain: process.env.COOKIE_DOMAIN,
            sameSite: 'strict',
            httpOnly: /true/i.test(process.env.COOKIE_HTTPONLY),
        });
    }
}
