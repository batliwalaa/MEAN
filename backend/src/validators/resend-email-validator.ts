import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';
import { Patterns } from '../keys/patterns';

@Injectable()
export class ResendEmailValidator implements IValidator {
    async validate(verificationtype: string, email: string): Promise<ErrorMessage[]> {
        const errors: Array<ErrorMessage> = [];
        if (isEmptyOrWhitespace(email)) {
            errors.push({ key: 'email', error: 'required' });
        }

        if (isEmptyOrWhitespace(verificationtype)) {
            errors.push({ key: 'verificationtype', error: 'required' });
        }

        if (!isEmptyOrWhitespace(email)) {
            const regex = new RegExp(Patterns.Email);
            if (!regex.test(email)) {
                errors.push({ key: 'email', error: 'invalid' });
            }
        }

        return errors;
    }
}
