import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import { Validators } from './validators';

@Injectable()
export class OtpEmailVerificationValidator implements IValidator {
    constructor(private validators: Validators) {}
    
    async validate(verificationtype: string, email: string, code: string): Promise<ErrorMessage[]> {
        const errors = await this.validators
            .isNotEmptyOrWhitespace('isoCode', email)
            .isNotEmptyOrWhitespace('verificationType', verificationtype)
            .isNotEmptyOrWhitespace('code', code)
            .errors();
            
        return errors;
    }
}
