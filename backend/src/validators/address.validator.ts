import { Injectable } from '../core/decorators';
import { Address, ErrorMessage, IValidator } from '../models';
import { Validators } from './validators';

@Injectable()
export class AddressValidator implements IValidator {
    constructor(private validators: Validators) {}

    async validate(address: Address): Promise<ErrorMessage[]> {
        const errors = await this.validators
            .isNotEmptyOrWhitespace('addressLine1', address.addressLine1)
            .isNotEmptyOrWhitespace('town', address.town)
            .isNotEmptyOrWhitespace('state', address.state)
            .isNotEmptyOrWhitespace('postcode', address.postcode)
            .isNotEmptyOrWhitespace('country', address.country)
            .includes(() => ['Work', 'Home'].includes(address.addressType), 'addressType')
            .errors();

        return errors;
    }
}
