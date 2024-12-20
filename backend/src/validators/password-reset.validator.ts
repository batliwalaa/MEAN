import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';
import { isEmptyOrWhiteSpace } from '../core/utils';

@Injectable()
export class PasswordResetValidator implements IValidator {
    async validate(email: string, isoCode: string, mobile: string): Promise<ErrorMessage[]> {
        const errors: Array<ErrorMessage> = [];
        const emailPattern =
            "(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|&#34;(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21\\x23-\\x5b\\x5d-\\x7f]|\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])*&#34;)@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\\x01-\\x08\\x0b\\x0c\\x0e-\\x1f\\x21-\\x5a\\x53-\\x7f]|\\\\[\\x01-\\x09\\x0b\\x0c\\x0e-\\x7f])+)\\])";

        if (isEmptyOrWhiteSpace(email) && isEmptyOrWhitespace(mobile)) {
            errors.push({ key: 'emailOrMobile', error: 'required' });
            return errors;
        }

        if (mobile.trim().length != 10 || isNaN(parseInt(mobile))) {
            errors.push({ key: 'mobile', error: 'invalid' });
            return errors;
        }

        if (!isEmptyOrWhitespace(mobile) && isEmptyOrWhitespace(isoCode)) {
            errors.push({ key: 'isoCode', error: 'required' });
            return errors;
        }

        if (!isEmptyOrWhitespace(email)) {
            const regex = new RegExp(emailPattern);
            if (!regex.test(email)) {
                errors.push({ key: 'email', error: 'invalid' });
                return errors;
            }
        }

        return errors;
    }
}
