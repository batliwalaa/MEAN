import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import { Validators } from './validators';

@Injectable()
export class PaymentRequestValidator implements IValidator {
    constructor(
        private validators: Validators
    ) {}

    async validate(addressID: string, amount: string, promotions: Array<string>, pointsToRedeem: string): Promise<ErrorMessage[]> {
        const nameof = (obj: any) => Object.keys(obj)[0];
        const errors = await this.validators
                            .isNotEmptyOrWhitespace(nameof({ addressID }), addressID)
                            .isNumber('pointsToRedeem', pointsToRedeem)
                            .isNumber('amount', amount)
                            .errors();
        return errors;
    }
}
