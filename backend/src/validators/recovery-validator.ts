import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';
import { Patterns } from '../keys/patterns';
import { LoginMode } from '../models/enums/login-mode';

@Injectable()
export class RecoveryValidator implements IValidator {
    async validate(mode: LoginMode, isoCode: string, userName: string): Promise<ErrorMessage[]> {
        const errors: Array<ErrorMessage> = [];
        if (isEmptyOrWhitespace(mode)) {
            errors.push({ key: 'mode', error: 'required' });
        }

        if (isEmptyOrWhitespace(isoCode)) {
            errors.push({ key: 'isoCode', error: 'required' });
        }

        if (isEmptyOrWhitespace(userName)) {
            errors.push({ key: 'userName', error: 'required' });
        }

        if (mode === LoginMode.Email && !isEmptyOrWhitespace(userName)) {
            const regex = new RegExp(Patterns.Email);
            if (!regex.test(userName)) {
                errors.push({ key: 'userName', error: 'invalid' });
            }
        }

        if (mode === LoginMode.Mobile && !isEmptyOrWhitespace(userName)) {
            if (userName.trim().length != 10 || isNaN(parseInt(userName))) {
                errors.push({ key: 'mobile', error: 'invalid' });
            }
        }

        return errors;
    }
}
