import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { ErrorMessage } from '../models';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';
import { UserService } from '../services';
import { Patterns } from '../keys/patterns';

@Injectable()
export class NewAccountValidator implements IValidator {
    constructor(private userService: UserService) {}

    async validate(
        firstName: string,
        lastName: string,
        email: string,
        isoCode: string,
        mobile: string,
        password: string,
        confirmPassword: string
    ): Promise<ErrorMessage[]> {
        const errors: Array<ErrorMessage> = [];
        if (isEmptyOrWhitespace(firstName)) {
            errors.push({ key: 'firstName', error: 'required' });
        }

        if (isEmptyOrWhitespace(lastName)) {
            errors.push({ key: 'lastName', error: 'required' });
        }

        if (isEmptyOrWhitespace(isoCode)) {
            errors.push({ key: 'isoCode', error: 'required' });
        }

        if (isEmptyOrWhitespace(mobile)) {
            errors.push({ key: 'mobile', error: 'required' });
        }

        if (isEmptyOrWhitespace(password)) {
            errors.push({ key: 'password', error: 'required' });
        }

        if (isEmptyOrWhitespace(confirmPassword)) {
            errors.push({ key: 'confirmPassword', error: 'required' });
        }

        if (!isEmptyOrWhitespace(password) && password !== confirmPassword) {
            errors.push({ key: 'password and confirm password', error: 'are not same' });
        }

        if (!isEmptyOrWhitespace(password) && (password.trim().length < 8 || password.trim().length > 32)) {
            errors.push({ key: 'password', error: 'invalid' });
        }

        if (!isEmptyOrWhitespace(mobile)) {
            if (mobile.trim().length != 10 || isNaN(parseInt(mobile))) {
                errors.push({ key: 'mobile', error: 'invalid' });
            } else {
                const user = await this.userService.getUserByMobile(isoCode, mobile);

                if (user) {
                    errors.push({ key: 'mobile', error: 'user with mobile already exists' });
                }
            }
        }

        if (!isEmptyOrWhitespace(email)) {
            const regex = new RegExp(Patterns.Email);
            if (!regex.test(email)) {
                errors.push({ key: 'email', error: 'invalid' });
            } else {
                const user = await this.userService.getUserByEmail(email);

                if (user) {
                    errors.push({ key: 'email', error: 'user with email already exists' });
                }
            }
        }

        return errors;
    }
}
