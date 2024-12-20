import { Request, Response } from 'express';
import { HttpStatusCode } from '../http.status.code';

const MultipartMiddleware = () => {    
    return async (request: Request, response: Response, next: any) => {
        try {
            const contentDisposition = request.headers['content-disposition'];

            if (contentDisposition && contentDisposition.includes('attachment')) {
                const type = request.headers['content-type'];
                const fileName = contentDisposition.split(';')[1].split('=')[1];

                let chunk: Array<any> = [];

                request.on('data', (d) => {
                    chunk = chunk.concat(...d);
                })

                request.on('end', () => {
                    // @ts-ignore
                    request.file = { length: chunk.length, buffer: chunk, filename: fileName, type: fileName.substring(fileName.lastIndexOf('.') + 1) };
                    next();
                });

                request.on('error', (e) => {
                    throw e;
                })
            } else {
                next();
            }
        } catch (e) {
            response.status(HttpStatusCode.InternalServerError).end();
        }
    };
};

export { MultipartMiddleware };
