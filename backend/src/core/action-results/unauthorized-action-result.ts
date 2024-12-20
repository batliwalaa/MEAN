import { ActionResult } from "./action-result";
import { HttpStatusCode } from "../http.status.code";

export class Unauthorized extends ActionResult {
    constructor() {
        super(HttpStatusCode.Unauthorized);
    }
}