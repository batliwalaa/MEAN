import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';

@Injectable()
export class ProductTypeValidator implements IValidator {
    async validate(type: string, pn: number): Promise<ErrorMessage[]> {
        const errors: Array<ErrorMessage> = [];

        if (!isNaN(pn) && pn < 1) {
            errors.push({ key: 'pn', error: 'invalid' });
            return errors;
        }

        if (isEmptyOrWhitespace(type)) {
            errors.push({ key: 'term', error: 'required' });
            return errors;
        }

        return errors;
    }
}
