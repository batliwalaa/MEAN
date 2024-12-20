import { ActionResult } from './action-result';
import { HttpStatusCode } from '../http.status.code';

export class Ok extends ActionResult {
    constructor(content?: any) {
        super(HttpStatusCode.Ok, content);
    }
}
