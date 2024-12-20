export abstract class ActionResult {
    constructor (statusCode: number, content: any = null, location: string = null) {
        this.status = statusCode;
        this.content = content;
        this.location = location;
    }

    readonly status: number;
    readonly content: any;
    readonly location: any;
}
