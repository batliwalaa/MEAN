import { FileType } from '../../models/enums/file-type';
import { DownloadFileResponse } from '..';
import { IRequest } from '../../core/mediator/request';

export class DownloadFileRequest implements IRequest<DownloadFileResponse> { 
    readonly orderID: string;   
    readonly fileType: FileType;
    readonly userID: string;

    constructor(
        userID: string,
        orderID: string,       
        fileType: FileType
    )
    {
        this.userID = userID;
        this.orderID = orderID;      
        this.fileType = fileType;
    }
}