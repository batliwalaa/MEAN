import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService, HttpService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class AdminService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public generate(): Promise<any> {
        const key = `delivery_slot_generation`;
        return this.executePost(key, `${this.baseUrl}/delivery/slots/generate`, {}).toPromise();
    }
}
