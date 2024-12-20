import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService, HttpService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class FooterService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public get(): Observable<any> {
        return this.executeGet('footer', `${this.baseUrl}/footer`);
    }
}
