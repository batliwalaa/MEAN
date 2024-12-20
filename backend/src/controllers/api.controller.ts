import {
    Accepted,
    BadRequest,
    Created,
    File,
    Forbidden,
    InternalServerError,
    NotFound,
    Ok,
    Redirect,
    Unauthorized,
} from '../core/action-results';
import { Request, Response } from 'express';

export abstract class ApiController {
    private _request: Request;
    private _response: Response;
    private _user: any;

    public Accepted(): Accepted {
        return new Accepted();
    }

    public BadRequest(content?: any): BadRequest {
        return new BadRequest(content);
    }

    public Created(content: any): Created {
        return new Created();
    }

    public Forbidden(content: any): Forbidden {
        return new Forbidden();
    }

    public InternalServerError(content: any): Ok {
        return new InternalServerError();
    }

    public NotFound(content?: any): NotFound {
        return new NotFound(content);
    }

    public Ok(content?: any): Ok {
        return new Ok(content);
    }

    public Redirect(location: string): Redirect {
        return new Redirect(location);
    }

    public Unauthorized(): Unauthorized {
        return new Unauthorized();
    }

    public File(filename: string, fileStream: any): File {
        return new File(filename, fileStream);
    } 

    public get request(): Request {
        return this._request;
    }

    public get response(): Response {
        return this._response;
    }

    public get user(): any {
        return this._user;
    }
}
