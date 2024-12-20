import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Inject, Injectable, PLATFORM_ID, TransferState } from "@angular/core";

import { EMPTY, Observable } from "rxjs";
import { FileType } from "../types/file-type";
import * as fileSaver from 'file-saver';

import { ConfigService } from "./config.service";
import { HttpService } from "./http.service";

@Injectable({
    providedIn: 'root'
})
export class FileService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }
    
    public upload(uploadType: string, productID: string, reviewID: string, dataURL: string, fileType: string, filename: string): Observable<any> {
        const url = `${this.baseUrl}/file/${uploadType}/${productID}/review/${reviewID}/upload`;
        const blob = this.convertDataUrlToBlob(dataURL, fileType);
        const options = {
            headers: new HttpHeaders({
                'Content-Type': blob.type,
                'Content-Disposition': `attachment; filename=${filename}`
            })
        }
        return this.httpClient.post(url, blob, options);
    }

    public remove(uploadType: string, productID: string, reviewID: string, filename: string): Observable<any> {
        const url = `${this.baseUrl}/file/${uploadType}/${productID}/review/${reviewID}/${filename}`;
        return this.httpClient.delete(url);
    }

    public convertDataUrlToBlob(dataUrl, type): Blob {
        const binary = atob(dataUrl.split(',')[1]);
        const array = [];
        for (let index = 0; index < binary.length; index++) {
            array.push(binary.charCodeAt(index));
        }
        return new Blob([new Uint8Array(array)], { type });
    }

    public downloadFile(orderID: string, fileType: FileType): Observable<any> {     
       return this.getFile(`${this.baseUrl}/file/order/${orderID}/type/${fileType}`, 'download', fileType);
    }

    public viewFile(orderID: string, fileType: FileType): Observable<any> {     
        return this.getFile(`${this.baseUrl}/file/order/${orderID}/type/${fileType}`, 'view', fileType);
     }

    private getFile(url: string, action: 'view'|'download', fileType: FileType): Observable<any> {
        this.httpClient.get(url, { responseType: 'arraybuffer', headers: { 'content-type': 'application/pdf' } })
        .subscribe(
            response => { 
                const blob = new Blob([response], {type: 'application/pdf' });               
                if (action === 'view') {
                    const url = window.URL.createObjectURL(blob);
                    window.open(url);
                } else {
                    fileSaver.saveAs(blob, `${fileType}.pdf`);
                }               
            }
        );
       return EMPTY;
    }
}