import { Request, Response } from 'express';
import { HttpStatusCode } from '../http.status.code';

const RequestLogger = () => {
    const logIncomingRequest = (path: string): void => {};

    return async (request: Request, response: Response, next: any) => {
        try {
            logIncomingRequest(request.path);
            next();
        } catch (e) {
            response.status(HttpStatusCode.InternalServerError).end();
        }
    };
};

export { RequestLogger };
