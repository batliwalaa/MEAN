import { Request, Response } from 'express';

export interface ICookieValidator {
    validateCookie(request: Request, response: Response): Promise<boolean>;
    clear(request: Request, response: Response): Promise<void>;
}
