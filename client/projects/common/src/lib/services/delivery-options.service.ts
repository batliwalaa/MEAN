import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from './config.service';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class DeliveryOptionsService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public async deliveryOptions(): Promise<any> {
        return await this.executeGet('delivery_options', `${this.baseUrl}/delivery/options`).toPromise();
    }
}
