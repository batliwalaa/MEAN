import { ActionResult } from "./action-result";
import { HttpStatusCode } from "../http.status.code";

export class Accepted extends ActionResult {
    constructor() {
        super(HttpStatusCode.Accepted);
    }
}