import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage, SearchMap } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';
import { isEmptyOrWhiteSpace } from '../core/utils';

@Injectable()
export class ProductSearchValidator implements IValidator {
    async validate(pn: number, map: any): Promise<Array<ErrorMessage>> {
        const errors: Array<ErrorMessage> = [];
        const searchMap: SearchMap = JSON.parse(Buffer.from(map, 'base64').toString('utf-8'));

        if (!isNaN(pn) && pn < 1) {
            errors.push({ key: 'pn', error: 'invalid' });
            return errors;
        }

        if (
            isEmptyOrWhitespace(searchMap.lob) &&
            isEmptyOrWhiteSpace(searchMap.searchString) &&
            isEmptyOrWhiteSpace(searchMap.description) &&
            (!searchMap.filters || searchMap.filters.length === 0) &&
            (!searchMap.types || searchMap.types.length === 0) &&
            (!searchMap.brands || searchMap.brands.length === 0)
        ) {
            errors.push({ key: 'search parameters', error: 'invalid' });
            return errors;
        }

        return errors;
    }
}
