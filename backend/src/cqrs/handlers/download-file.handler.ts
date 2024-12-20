import { IHandler } from '../../core/mediator/handler';
import { Injectable } from '../../core/decorators';
import { OrderService } from '../../services';
import { DownloadFileRequest, DownloadFileResponse } from '..';
import { FileType } from '../../models/enums/file-type';
import fs from 'fs';
import INVOICE_PATH from '../../constants/invoice-path.constant';
import CREDIT_NOTE_PATH from '../../constants/credit-note-path.constants';
import path from 'path'
import { DownloadFileStatus } from '../../models';
import { RedisService } from '../../cache';
import { PubSubChannelKeys } from '../../keys/redis-pub-sub-channel.keys';

@Injectable()
export class DownloadFileHandler implements IHandler<DownloadFileRequest, DownloadFileResponse> {
    
    constructor(
        private readonly orderService: OrderService,
        private readonly redisService: RedisService
    ){}

    public async handle(request: DownloadFileRequest): Promise<DownloadFileResponse> {
        const filename = await this.orderService.getDocumentFilename(request.orderID, request.fileType);
        const fileExists: boolean = fs.existsSync(path.join((request.fileType === FileType.Invoice ? INVOICE_PATH : CREDIT_NOTE_PATH), filename));
        const fileStream: fs.ReadStream = fileExists ? fs.createReadStream(path.join((request.fileType === FileType.Invoice ? INVOICE_PATH : CREDIT_NOTE_PATH), filename)) : null;

        if (!fileExists) {
            await this.redisService.publish(PubSubChannelKeys.InvoiceGenerateChannel, 
                JSON.stringify({
                    orderID: request.orderID,
                    userID: request.userID
                }));
        }

        return { filename, fileStream, fileStatus: !fileExists ? DownloadFileStatus.InProgress : DownloadFileStatus.Ready };
    }
}