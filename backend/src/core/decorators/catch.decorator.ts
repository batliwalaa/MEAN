import { IncomingMessage } from 'http';
import { HttpStatusCode } from '../http.status.code';
import { Logging } from '../structured-logging/log-manager';
import { Logger } from '../structured-logging/logger';

export const Catch = (): MethodDecorator => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
        const originalMethod = descriptor.value;
        let logger: Logger;
        const t = target;
        const pk = propertyKey;

        const getLogger = () => {
            if (!logger) {
                logger = Logging.getLogger(`${t.constructor.name}`);
            }

            return logger;
        };

        descriptor.value = async function (...args: any) {
            try {
                return await originalMethod.apply(this, args);
            } catch (e) {
                getLogger().error('Error: request error', { action: pk }, e);
                for (let i = 0; i < args.length; i++) {
                    if (args[i] instanceof IncomingMessage) {
                        args[i].res.sendStatus(HttpStatusCode.InternalServerError).end();
                        break;
                    }
                }
            }
        };

        return descriptor;
    };
};
