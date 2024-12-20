import { ActionResult } from "./action-result";
import { HttpStatusCode } from "../http.status.code";

export class BadRequest extends ActionResult {
    constructor(content: any) {
        super(HttpStatusCode.BadRequest, content);
    }
}