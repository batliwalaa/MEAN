import request from 'request';

import { Injectable } from '../core/decorators';

@Injectable()
export class VerifyRecaptchaService {
    public async verify(recaptchaToken: string) {
        return new Promise<string>((resolve, _) => {
            const secret = process.env.RECAPTCHA_SECRET_KEY;
            const path = process.env.RECAPTCHA_VERIFY_PATH;
            const url = `${path}?secret=${secret}&response=${recaptchaToken}`;

            request(url, (error, response, body) => {
                resolve(JSON.parse(body));
            });
        });
    }
}
