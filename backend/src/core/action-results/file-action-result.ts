import { Ok } from '.';

export class File extends Ok {
    readonly filename: string;
    readonly fileStream: any;

    constructor(filename: string, fileStream: any) {
        super();
        this.fileStream = fileStream;
        this.filename = filename;
    }
}
