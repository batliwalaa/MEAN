
import { isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, delay } from 'rxjs/operators';

import { ConfigService } from './config.service';
import { AuthState } from './auth.state';
import { IConfiguration } from '../types/configuration';
import { makeStateKey, TransferState } from '@angular/core';

export abstract class HttpService {
    constructor(
        protected httpClient: HttpClient,
        private platformId: any,
        private transferState: TransferState,
        private configService: ConfigService
    ) {}

    executeGet(transferStateKey: string, url: string): Observable<any> {
        return this.execute(transferStateKey, () => this.httpClient.get(url).pipe(delay(this.delayTime)));
    }

    executePost(transferStateKey: string, url: string, postData: any, options?: any): Observable<any> {
        return this.execute(transferStateKey, 
            () => this.httpClient.post(url, postData, options).pipe(delay(this.delayTime)));
    }

    protected get configuration(): IConfiguration {
        return this.configService.getConfiguration();
    }

    protected get baseUrl(): string {
        return (this.configuration.isDockerDeployed ? this.configuration.apiEndpoint : this.configuration.nonDockerApiEndpoint);
    }

    protected get delayTime(): number {
        return AuthState.Refreshing ? 500 : 0;
    }

    private execute(transferStateKey: string, func: () => Observable<any>): Observable<any> {
        const STATE_KEY = makeStateKey<any>(transferStateKey);

        if (this.transferState.hasKey(STATE_KEY)) {
            const data = this.transferState.get<any>(STATE_KEY, null);

            this.transferState.remove(STATE_KEY);

            return of(data);
        } else {
            return func().pipe(
                tap((data) => {
                    if (isPlatformServer(this.platformId)) {
                        this.transferState.set(STATE_KEY, data);
                    }
                })
            );
        }
    }
}
