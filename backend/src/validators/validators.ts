import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';
import { ErrorMessage } from '../models';

export class Validators {
    private _errors: Array<ErrorMessage> = [];

    public isNotEmptyOrWhitespace(propertyName: string, value?: any): Validators {
        if (isEmptyOrWhitespace(value)) {
            this._errors.push({ key: propertyName, error: 'required' });
        }

        return this;
    }

    public minMaxLength(propertyName: string, min: number, max: number, value: string): Validators {
        if (value.trim().length < min || value.trim().length > max) {
            this._errors.push({ key: propertyName, error: 'invalid' });
        }

        return this;
    }

    public fixedLength(propertyName: string, fixedLength: number, value: string): Validators {
        if (value.trim().length !== fixedLength) {
            this._errors.push({ key: propertyName, error: 'invalid' });
        }

        return this;
    }

    public isNumber(propertyName: string, value: string): Validators {
        if (isNaN(parseInt(value))) {
            this._errors.push({ key: propertyName, error: 'invalid' });
        }

        return this;
    }

    public areEqual(property1Name: string, property2Name: string, value1: string, value2: string): Validators {
        if (value1 !== value2) {
            this._errors.push({ key: `${property1Name} and ${property2Name}`, error: 'are not same' });
        }

        return this;
    }

    public regexTest(propertyName: string, pattern: string, value: string): Validators {
        const regex = new RegExp(pattern);

        if (!regex.test(value)) {
            this._errors.push({ key: propertyName, error: 'invalid' });
        }

        return this;
    }

    public if(predicate: () => boolean, func: () => { key: string, error: string }): Validators {
        if (!predicate()) {
            this._errors.push(func());
        }

        return this;
    }

    public includes(predicate: () => boolean, propertyName: string): Validators {
        if (!predicate()) {
            this._errors.push({ key: propertyName, error: `please select valid ${propertyName}` });
        }

        return this;
    }

    public or(predicate: () => boolean, propertyName: string): Validators {
        if (!predicate()) {
            this._errors.push({ key: propertyName, error: `please provide atleast one value of ${propertyName}` });
        }

        return this;
    }

    public errors(): Promise<Array<ErrorMessage>> {
        return Promise.resolve(this._errors);
    }
}
