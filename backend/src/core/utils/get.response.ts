import { IncomingMessage } from "http";
import { Response } from "express";

const getResponse = (args: any): Response => {
    for (let i = 0; i < args.length; i++) {
        if (args[i] instanceof IncomingMessage) {
            return args[i].res;
        }
    }

    return null;
};

export default getResponse;
