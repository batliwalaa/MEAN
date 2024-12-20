import { Type } from '../../typings/decorator';
import { IValidator } from '../../models/validator';
import { BadRequest } from '../action-results';
import { Injector } from '../di/injector';

export const Validator = (validator: Type<IValidator>): MethodDecorator => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any) {
            const v = <IValidator>Injector.resolve(validator);
            const errors = await v.validate(...args);

            if (errors.length === 0) {
                return await originalMethod.apply(this, args);
            } else {
                return new BadRequest(errors);
            }
        };

        return descriptor;
    };
};
