import { EventEmitter } from "events";
import { Type } from "../../typings/decorator";
import { Injector } from "../di/injector";
import { IHandler } from "./handler";
import { IRequest } from "./request";

export class MediatR {
    private static eventEmitter: EventEmitter = new EventEmitter();

    public static async send<TResponse>(request: IRequest<TResponse>): Promise<TResponse> {
        const requestName = request.constructor.name;

        if (MediatR.hasListener(requestName)) {
            return await new Promise((resolve) => {
                MediatR.eventEmitter.emit(requestName, request, (result: TResponse) => {
                    resolve(result);
                });
            });
        }

        return await Promise.reject(`No handler registered for request: ${requestName}`);
    }

    public static registerHandler<TRequest extends IRequest<TResponse>, TResponse>(
        requestName: string,
        target: Type<IHandler<TRequest, TResponse>>
    ) {
        MediatR.eventEmitter.on(
            requestName,
            async (request: TRequest, listener: (result: TResponse) => void) => {
                const handler = Injector.resolve<IHandler<TRequest, TResponse>>(target);
                const result = await handler.handle(request);
                listener(result);
            }
        )
    }

    private static hasListener(requestName: string): boolean {
        const names = MediatR.eventEmitter.eventNames();
        return names.includes(requestName);
    }
}
