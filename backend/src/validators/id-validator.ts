import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';

@Injectable()
export class IdValidator implements IValidator {
    async validate(idOrKey: string): Promise<ErrorMessage[]> {
        let errors: Array<ErrorMessage> = [];

        if (isEmptyOrWhitespace(idOrKey)) {
            errors.push({ key: 'id or key', error: 'required' });
        }

        return errors;
    }
}
