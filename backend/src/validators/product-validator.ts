import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';

@Injectable()
export class ProductValidator implements IValidator {
    async validate(type: string, brand: string, subtype: string): Promise<ErrorMessage[]> {
        const errors: Array<ErrorMessage> = [];

        if (isEmptyOrWhitespace(type)) {
            errors.push({ key: 'type', error: 'required' });
            return errors;
        }

        if (!isEmptyOrWhitespace(subtype) && isEmptyOrWhitespace(brand)) {
            errors.push({ key: 'brand', error: 'required' });
            return errors;
        }

        return errors;
    }
}
