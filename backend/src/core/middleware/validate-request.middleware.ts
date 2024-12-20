import { Request, Response } from 'express';

import { HttpStatusCode } from '../http.status.code';

const ValidateRequest = () => {
    return async (request: Request, response: Response, next: any) => {
        try {
            const referer = request.header('referer');
            const origin = request.header('origin');

            if (request.originalUrl.includes('/payment/response')) {
                next();
            } else // if (referer && origin && referer.includes(origin)) {
                if (request.method.toLowerCase() === 'post') {
                    const xsrf = request.header('x-xsrf-token');
                    if (xsrf === request.session.xsrf) {
                        // request.session.xsrf = null;
                        next();
                    } else {
                        response.status(HttpStatusCode.Unauthorized).end();
                    }
                } else {
                    next();
                }
            /*} else {
                response.status(HttpStatusCode.Unauthorized).end();
            } */
        } catch (e) {
            response.status(HttpStatusCode.InternalServerError).end();
        }
    };
};

export { ValidateRequest };
