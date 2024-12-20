import { Type } from '../../typings/decorator';
import { ICookieValidator } from '../../models';
import { Injector } from '../di/injector';
import { getRequest, getResponse } from '../utils';
import { HttpStatusCode } from '../http.status.code';

export const CookieValidator = (cookieValidator: Type<ICookieValidator>, clear: boolean = false): MethodDecorator => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any) {
            const request = getRequest(args);
            const response = getResponse(args);

            const c = <ICookieValidator>Injector.resolve(cookieValidator);

            const isValid = await c.validateCookie(request, response);
            const returnValue = isValid ? await originalMethod.apply(this, args) : null;

            if (!!clear) {
                await c.clear(this.request, this.response);
            }
            if (isValid) {
                return returnValue;
            } else {
                response.sendStatus(HttpStatusCode.Unauthorized).end();
            }
        };

        return descriptor;
    };
};
