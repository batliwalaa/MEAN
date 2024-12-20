import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import { Validators } from './validators';

@Injectable()
export class ChangePasswordValidator implements IValidator {
    constructor(private validators: Validators) {}

    async validate(password: string, confirmPassword: string): Promise<ErrorMessage[]> {
        const nameof = (obj: any) => Object.keys(obj)[0];

        const errors = await this.validators
            .isNotEmptyOrWhitespace(nameof({ password }), password)
            .isNotEmptyOrWhitespace(nameof({ confirmPassword }), confirmPassword)
            .areEqual(nameof({ password }), nameof({ confirmPassword }), password, confirmPassword)
            .errors();

        return errors;
    }
}
