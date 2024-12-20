import { RouteDefinition } from '../../models';

export const Put = (path: string | string[]): MethodDecorator => {
    return (target: any, propertyKey: string): void => {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        const routes = Reflect.getMetadata('routes', target.constructor) as Array<RouteDefinition>;

        if (Array.isArray(path)) {
            for (let i = 0; i < path.length; i++) {
                routes.push({
                    requestMethod: 'put',
                    path: <string>path[i],
                    methodName: propertyKey,
                });
            }
        } else {
            routes.push({
                requestMethod: 'put',
                path,
                methodName: propertyKey,
            });
        }

        Reflect.defineMetadata('routes', routes, target.constructor);
    };
};