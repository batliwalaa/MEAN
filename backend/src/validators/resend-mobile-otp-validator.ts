import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import { Validators } from './validators';

@Injectable()
export class ResendMobileOtpValidator implements IValidator {
    constructor(private validators: Validators) {}
    
    async validate(verificationtype: string, isoCode: string, mobile: string): Promise<ErrorMessage[]> {
        const errors = await this.validators
            .isNotEmptyOrWhitespace('isoCode', isoCode)
            .isNotEmptyOrWhitespace('mobile', mobile)
            .isNotEmptyOrWhitespace('verificationType', verificationtype)
            .errors();
            
        return errors;
    }
}
