import { DownloadFileStatus } from "../../models";

export interface DownloadFileResponse {
    filename: string;
    fileStream: any;
    fileStatus: DownloadFileStatus;
}
