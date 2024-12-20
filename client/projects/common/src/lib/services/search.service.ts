import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from './config.service';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root',
})
export class SearchService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public quickSearch(term: string, pn: number = 1): Observable<any> {
        return this.executeGet(`product_search_${term}_${pn}`, `${this.baseUrl}/product/search/${term}/${pn}`);
    }

    public search(query: any, pn: number = 1): Observable<any> {
        const key = `product_search_map_${pn}_${query}`;
        return this.executeGet(key, `${this.baseUrl}/product/search/map/${pn}/${query}`);
    }
}
