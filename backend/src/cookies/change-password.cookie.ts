import { Injectable } from '../core/decorators';
import { ICookie, VerificationType } from '../models';
import { Response, Request } from 'express';
import { BaseCookie } from './base.cookie';

@Injectable()
export class ChangePasswordCookie extends BaseCookie implements ICookie {
    async setCookie(request: Request, response: Response, content: any): Promise<void> {
        if (content && content.type === VerificationType.ResetPassword) {
            await super.cookie('cp', 1000 * 60 * 10, request, response, content);
        }
    }
}
