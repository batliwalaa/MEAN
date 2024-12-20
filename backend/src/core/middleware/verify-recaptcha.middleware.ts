/* import { Request, Response } from 'express';
import { VerifyRecaptchaService } from '../../services';
import { Injector } from '../di/injector';

const VerifyRecaptcha = () => {

    return async (request: Request, response: Response, next: any) => {
        if (request.method.toLowerCase() === 'post') {
            const verifyRecaptchaService = Injector.resolve<VerifyRecaptchaService>(VerifyRecaptchaService);
            const result: any = await verifyRecaptchaService.verify(request);

            if (!result.success || result.score <= 0.5) {
                response.send({ state: 'RecaptchaVerificationFailure' });
            } else {
                next();
            }
        } else {
            next();
        }
    };
};

export { VerifyRecaptcha };
 */
