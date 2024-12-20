import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';

@Injectable()
export class HomeKeyValidator implements IValidator {
    async validate(key: string): Promise<ErrorMessage[]> {
        let errors: Array<ErrorMessage> = [];
        const validKeys: Array<string> = ['homepage', 'homegarden-homepage', 'pantry-homepage'];

        if (isEmptyOrWhitespace(key)) {
            errors.push({ key: 'key', error: 'required' });
            return errors;
        }

        if (!validKeys.includes(key.toLowerCase())) {
            errors.push({ key: 'key', error: 'invalid' });
            return errors;
        }

        return errors;
    }
}
