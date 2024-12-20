import { ActionResult } from '../action-results/action-result';
import { getRequest, getResponse } from '../utils';
import { HttpStatusCode } from '../http.status.code';
import isEmptyOrWhitespace from '../utils/is-empty-or-whitespace';
import { File } from '../action-results';

export const ModelBinder = (properties: Array<string>): MethodDecorator => {
    return (target: any, propertyKey: string, descriptor: PropertyDescriptor): any => {
        const originalMethod = descriptor.value;
        const originalTarget = target;

        descriptor.value = async function (...args: any) {
            const request = getRequest(args);
            const response = getResponse(args);
            const parameters: Array<any> = [];

            for (let index = 0; index < properties.length; index++) {
                const parts = properties[index].split('::');

                if (parts && parts.length > 0) {
                    if (parts.length === 1) {
                        parameters.push(request.params[parts[0]]);
                    } else if (parts.length === 2 && !parts[0].startsWith('@')) {
                        switch (parts[1]) {
                            case 'number':
                                parameters[index] = Number(request.params[parts[0]]);
                                break;
                            case 'boolean':
                                parameters[index] = Boolean(request.params[parts[0]]);
                                break;
                            default:
                                parameters[index] = request.params[parts[0]];
                                break;
                        }
                    } else if (parts.length >= 2 && parts.length <= 3 && parts[0] === '@FromBody') {
                        parameters[index] = request.body[parts[1]];
                    } else if (parts.length >= 2 && parts.length <= 3 && parts[0] === '@FromHeader') {
                        if (parts[1].toLowerCase() === 'authorization') {
                            const header = <string>request.headers['authorization'] || '';
                            if (!isEmptyOrWhitespace(header)) {
                                const value = header.split(/\s+/).pop() || '';
                                if (!isEmptyOrWhitespace(value)) {
                                    if (parts[2].toLowerCase() === 'basic') {
                                        const data = Buffer.from(value, 'base64').toString();
                                        const dataParts = data.split(':');

                                        parameters.push(dataParts[0]);
                                        parameters.push(dataParts[1]);
                                        parameters.push(dataParts[2]);
                                        parameters.push(dataParts[3]);
                                    } else if (
                                        parts[2].toLowerCase() === 'token' ||
                                        parts[2].toLowerCase() === 'bearer'
                                    ) {
                                        parameters.push(value);
                                    }
                                }
                            }
                        } else if (parts[1].toLowerCase() === 'x-recaptcha-token') {
                            parameters.push(<string>request.headers['x-recaptcha-token'] || '');
                        }
                    } else {
                        // should not come to this point, modelbinder attribute definition failure for action
                        response.status(HttpStatusCode.InternalServerError).end();
                    }
                }
            }

            originalTarget['_request'] = request;
            originalTarget['_response'] = response;

            const result: ActionResult = await originalMethod.apply(this, parameters);

            if (result instanceof(File)) {              
                response.setHeader('Content-disposition', 'attachment; filename=' + result.filename);
                response.setHeader('Content-type', 'application/pdf');
                result.fileStream.pipe(response)
            } else {
                response.location(result.location);
                response.status(result.status).send(result.content).end();
            }           
        };

        return descriptor;
    };
};
