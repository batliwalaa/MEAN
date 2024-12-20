import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService, HttpService, LikeDislikeVote } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class DetailService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public get(id: string): Observable<any> {
        return this.executeGet(`product_${id}`, `${this.baseUrl}/product/${id}`);
    }

    public getPackSizes(id: string): Observable<any> {
        return this.executeGet(`product_${id}`, `${this.baseUrl}/product/id/${id}/sizes`);
    }
}
