import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from './config.service';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class GlobalisationService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public get(section: string): Observable<any> {
        const language = this.configuration && this.configuration.language || 'en';
        
        if (!this.configuration.useLocalResourcePointEndpoint) {
            return this.executeGet(
                `assets_resources_${section}`,
                `${this.configuration.resourceEndpoint}/resource/${section}`
            );
        } else  {
            return this.executeGet(
                `assets_resources_${section}`,
                `${this.configuration.localResourcePointEndpoint}/${language}/${section}.json`
            );
        }
    }
}
