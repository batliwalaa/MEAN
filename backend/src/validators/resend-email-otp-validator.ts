import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';
import { Validators } from './validators';

@Injectable()
export class ResendEmailOtpValidator implements IValidator {
    constructor(private validators: Validators) {}
    
    async validate(verificationtype: string, email: string): Promise<ErrorMessage[]> {
        const errors = await this.validators
            .isNotEmptyOrWhitespace('email', email)
            .isNotEmptyOrWhitespace('verificationType', verificationtype)
            .errors();
            
        return errors;
    }
}
