import { Request, Response } from 'express';

const ResponseHeader = () => {
    return async (req: Request, response: Response, next: any) => {
        response.removeHeader('X-Powered-By');
        response.setHeader('Access-Control-Expose-Headers', ['x-xsrf-token', 'x-recaptcha-token']);

        next();
    };
};

export { ResponseHeader };
