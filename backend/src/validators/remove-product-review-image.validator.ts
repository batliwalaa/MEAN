import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import { Validators } from './validators';

@Injectable()
export class RemoveProductReviewImageValidator implements IValidator {
    constructor(private validators: Validators) {}
    
    async validate(productID: string, reviewID: string, filename: string): Promise<ErrorMessage[]> {
        const errors = await this.validators
        .isNotEmptyOrWhitespace('reviewID', reviewID)
        .isNotEmptyOrWhitespace('productID', productID)
        .isNotEmptyOrWhitespace('filename', filename)
        .errors();

    return errors;
    }
}
