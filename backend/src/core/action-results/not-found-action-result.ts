import { ActionResult } from "./action-result";
import { HttpStatusCode } from "../http.status.code";

export class NotFound extends ActionResult {
    constructor(content?: any) {
        super(HttpStatusCode.NotFound, content);
    }
}