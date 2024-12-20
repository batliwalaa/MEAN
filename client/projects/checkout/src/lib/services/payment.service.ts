import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService, HttpService } from '@common/src/public-api';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PaymentService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public async initiatePayment(addressID: string, amount: number, pointsToRedeem: number = 0, promotions: Array<string> = []): Promise<any> {
        return await this.executePost('checkout_initiate_payment', `${this.baseUrl}/payment/initiate`, {
            addressID, amount, pointsToRedeem, promotions
        }).toPromise();
    }

    public paymentResponse(response: any): Observable<any> {
        return this.executePost('checkout_payment_response', `${this.baseUrl}/payment/response`, { response });
    }
}
