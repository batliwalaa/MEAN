import { Injectable } from "../core/decorators";
import { ErrorMessage } from "../models";
import { IdValidator } from "./id-validator";
import { Validators } from "./validators";

@Injectable()
export class LanguageValidator implements IdValidator {
    private allowedLanguages = ['en'];

    constructor(private validators: Validators) {
    }

    async validate(language: string): Promise<ErrorMessage[]> {
        const errors = await this.validators.isNotEmptyOrWhitespace(language).errors();

        if (errors.length > 0) return errors

        if (!this.allowedLanguages.includes(language)) {
            errors.push({ key: 'language', error: 'Invalid language' });
        }

        return errors;
    }
}
