import { IRequest } from "./request";

export interface IHandler<TRequest extends IRequest<TResponse>, TResponse> {
    handle(request: TRequest): Promise<TResponse>;
}