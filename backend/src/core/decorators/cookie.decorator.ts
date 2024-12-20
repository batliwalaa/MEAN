import { Type } from '../../typings/decorator';
import { ICookie } from '../../models/cookie';
import { Injector } from '../di/injector';
import { IModifier } from '../../models';

export const Cookie = (cookie: Type<ICookie>, modifier?: Type<IModifier>): MethodDecorator => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any) {
            const c = <ICookie>Injector.resolve(cookie);
            const returnValue = await originalMethod.apply(this, args);

            await c.setCookie(this.request, this.response, returnValue.content);

            if (modifier) {
                const m = <IModifier>Injector.resolve(modifier);
                returnValue.content = await m.modify(returnValue.content);
            }
            return returnValue;
        };

        return descriptor;
    };
};
