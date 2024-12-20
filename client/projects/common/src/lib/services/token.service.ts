import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { ConfigService } from './config.service';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class TokenService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public async verify(token: string): Promise<any> {
        return await this.httpClient.post(`${this.baseUrl}/auth/token/verify`, { token: token }).toPromise();
    }

    public async refresh(): Promise<any> {
        return await this.httpClient.post(`${this.baseUrl}/auth/token/refresh`, {}).toPromise();
    }

    public async revoke(): Promise<any> {
        return await this.httpClient.post(`${this.baseUrl}/auth/token/revoke`, {}).toPromise();
    }

    public async signin(mode: string, isoCode: string, username: string, password: string): Promise<any> {
        const base64Auth = btoa(`${mode}:${isoCode}:${username}:${password}`);
        const headers = { Authorization: `Basic ${base64Auth}` };

        return await this.httpClient
            .post(
                `${this.baseUrl}/auth/signin`,
                {},
                {
                    headers: new HttpHeaders(headers),
                }
            )
            .toPromise();
    }

    public async xsrf(): Promise<void> {
        await this.httpClient.get(`${this.baseUrl}/auth/token/xsrf`, {}).toPromise();
    }
}
