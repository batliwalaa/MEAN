import { ServerResponse } from "http";
import { Request } from "express";

const getRequest = (args: any): Request => {
    for (let i = 0; i < args.length; i++) {
        if (args[i] instanceof ServerResponse) {
            return args[i].req;
        }
    }

    return null;
};

export default getRequest;
