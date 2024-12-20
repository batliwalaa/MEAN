import { ActionResult } from "./action-result";
import { HttpStatusCode } from "../http.status.code";

export class Forbidden extends ActionResult {
    constructor() {
        super(HttpStatusCode.Forbidden);
    }
}