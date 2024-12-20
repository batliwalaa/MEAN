import { ActionResult } from "./action-result";
import { HttpStatusCode } from "../http.status.code";

export class InternalServerError extends ActionResult {
    constructor() {
        super(HttpStatusCode.InternalServerError);
    }
}