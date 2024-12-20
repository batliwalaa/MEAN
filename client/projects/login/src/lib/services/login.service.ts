import { Injectable, PLATFORM_ID, Inject, TransferState} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { AuthService, HttpService, ConfigService } from '@common/src/public-api';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class LoginService extends HttpService {
    constructor(
        private authService: AuthService,
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public async validateUsername(mode: string, userName: string, isoCode: string): Promise<any> {
        return await this.httpClient
            .post(`${this.baseUrl}/user/validateusername`, {
                mode,
                isoCode,
                userName,
            })
            .pipe(first())
            .toPromise();
    }

    public async signin(mode: string, username: string, isoCode: string, password: string): Promise<void> {
        await this.authService.login(mode, isoCode, username, password);
    }
}
