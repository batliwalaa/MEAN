import { Injectable } from '../core/decorators';
import { ICookie } from '../models';
import { Request, Response } from 'express';
import { BaseCookie } from './base.cookie';

@Injectable()
export class OtpVerificationCookie extends BaseCookie implements ICookie {
    async setCookie(request: Request, response: Response, content: any): Promise<void> {
        await super.cookie('ov', 1000 * 60 * 10, request, response, content);
    }
}
