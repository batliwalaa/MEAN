import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import { Validators } from './validators';

@Injectable()
export class OtpMobileVerificationValidator implements IValidator {
    constructor(private validators: Validators) {}
    
    async validate(verificationtype: string, isoCode: string, mobile: string, code: string): Promise<ErrorMessage[]> {
        const errors = await this.validators
            .isNotEmptyOrWhitespace('isoCode', isoCode)
            .isNotEmptyOrWhitespace('mobile', mobile)
            .isNotEmptyOrWhitespace('verificationType', verificationtype)
            .isNotEmptyOrWhitespace('code', code)
            .errors();
            
        return errors;
    }
}
