import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { delay } from 'rxjs/operators';

import { HttpService } from './http.service';
import { ConfigService } from './config.service';
import { Address } from '../types/address';

@Injectable({
    providedIn: 'root',
})
export class AddressService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public async getForUser(): Promise<any> {
        return await this.executeGet(`address_getforuser`, `${this.baseUrl}/address/user`).toPromise();
    }

    public async save(address: Address): Promise<any> {
        return await this.executePost('checkout_save_new_address', `${this.baseUrl}/address/save`, {
            address,
        }).toPromise();
    }

    public async delete(id: string): Promise<any> {
        let d = await this.httpClient.delete(`${this.baseUrl}/address/${id}`).pipe(delay(this.delayTime)).toPromise();
        return d;
    }

    public async getById(id: string): Promise<any> {
        return await this.executeGet(`address_getbyid`, `${this.baseUrl}/address/user/${id}`).toPromise();
    }
}
