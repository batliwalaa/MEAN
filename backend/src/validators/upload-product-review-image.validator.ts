import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import { Validators } from './validators';

@Injectable()
export class UploadProductReviewImageValidator implements IValidator {
    constructor(private validators: Validators) {}
    
    async validate(productID: string, reviewID: string): Promise<ErrorMessage[]> {
        const errors = await this.validators
            .isNotEmptyOrWhitespace('reviewID', reviewID)
            .isNotEmptyOrWhitespace('productID', productID)
            .errors();

        return errors;
    }
}
