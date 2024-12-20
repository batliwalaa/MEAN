import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage, SearchMap } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';

@Injectable()
export class MenuValidator implements IValidator {
    async validate(key: string, device?: string): Promise<Array<ErrorMessage>> {
        let errors: Array<ErrorMessage> = [];
        const validKeys: Array<string> = [
            'mainmenu',
            'burger menu',
            'daily essentials',
            'dairy',
            'bakery',
            'beverages',
            'snacks & branded foods',
            'personal hygiene',
            'home care',
            'baby care'
        ];
        const devices: Array<string> = ['desktop', 'mobile', 'tablet'];
        const lobs: Array<string> = ['pantry'];

        if (isEmptyOrWhitespace(key)) {
            errors.push({ key: 'key', error: 'required' });
            return errors;
        }

        if (!isEmptyOrWhitespace(device)) {
            if (!devices.includes(device.toLowerCase())) {
                errors.push({ key: 'device', error: 'invalid' });
                return errors;
            }
        }

        if (!validKeys.includes(key.toLowerCase())) {
            const json: SearchMap = JSON.parse(Buffer.from(key, 'base64').toString('utf-8'));

            if (!json.brands && !json.description && !json.filters && !json.lob && !json.searchString && !json.subTypes && !json.types) {
                errors.push({ key: 'key', error: 'invalid' });
                return errors;
            }
        }

        return errors;
    }
}
