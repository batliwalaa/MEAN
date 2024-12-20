import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService, HttpService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class LoyaltyPointService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public async availablePoints(): Promise<any> {
        return await this.executeGet('checkout_available_loyalty_points', `${this.baseUrl}/loyalty/point/available`).toPromise();
    }
}
