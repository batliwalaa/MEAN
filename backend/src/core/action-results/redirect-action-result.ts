import { ActionResult } from './action-result';
import { HttpStatusCode } from '../http.status.code';

export class Redirect extends ActionResult {
    constructor(location: string) {
        super(HttpStatusCode.Redirect, null, location);
    }
}
