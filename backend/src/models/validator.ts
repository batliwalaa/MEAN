import { ErrorMessage } from '.';

export interface IValidator {
    validate(...params: Array<any>): Promise<Array<ErrorMessage>>;
}
