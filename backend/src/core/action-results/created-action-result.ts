import { ActionResult } from "./action-result";
import { HttpStatusCode } from "../http.status.code";

export class Created extends ActionResult {
    constructor() {
        super(HttpStatusCode.Created);
    }
}