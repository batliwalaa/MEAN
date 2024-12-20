import jsonNullValueHandler from '../../utils/jsonNullValueHandler';
import jsonStringEnumHandler from '../../utils/jsonStringEnumHandler';

export class JsonSerializer {
    private static handlers: Array<any> = [jsonNullValueHandler, jsonStringEnumHandler];

    public static push(handler: any) {
        JsonSerializer.handlers.push(handler);
    }

    public static getHandlers() {
        return JsonSerializer.handlers;
    }
}

export default (key: string, value: string) => {
    const handlers = JsonSerializer.getHandlers();

    handlers.forEach((handler) => {
        value = handler(key, value);
    });

    return value;
};
