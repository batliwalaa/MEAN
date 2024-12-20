import { Type } from '../../typings/decorator';
import { Injector } from '../di/injector';
import { IModifier } from '../../models';

export const Modifier = (modifier: Type<IModifier>): MethodDecorator => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any) {
            const c = <IModifier>Injector.resolve(modifier);
            const returnValue = await originalMethod.apply(this, args);

            returnValue.content = await c.modify(returnValue.content);

            return returnValue;
        };

        return descriptor;
    };
};
