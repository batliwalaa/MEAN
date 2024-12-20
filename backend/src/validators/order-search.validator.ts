import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage, OrderSearchMap } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';
import { Validators } from './validators';

@Injectable()
export class OrderSearchValidator implements IValidator {
    constructor(private validators: Validators) {}
    
    async validate(pn: any, map: any): Promise<ErrorMessage[]> {
        const searchMap: OrderSearchMap = JSON.parse(Buffer.from(map, 'base64').toString('utf-8'));

        const errors = await this.validators
            .isNumber('pn', pn)
            .if(() => pn > 0, () => { return { key: 'pn', error: `pageNumber should be > 0` } })
            .isNotEmptyOrWhitespace('searchMap', searchMap)
            .or(() => 
                !isEmptyOrWhitespace(searchMap.from) ||
                !isEmptyOrWhitespace(searchMap.to) ||
                (Array.isArray(searchMap.query) && searchMap.query.length > 0), 'searchMap' )
            .errors();

        return errors;
    }
}
