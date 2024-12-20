import { Request, Response } from 'express';

export interface ICookie {
    setCookie(request: Request, response: Response, content: any): Promise<void>;
}
