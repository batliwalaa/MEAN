import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IConfiguration } from '../types/configuration';
import { first, switchMap } from 'rxjs/operators';

@Injectable()
export class ConfigService {
    private config: IConfiguration;

    constructor(private http: HttpClient) {}

    public async load(url: string): Promise<any> {
        const cacheBustDate = new Date();
        url += '?' + cacheBustDate.getUTCMilliseconds();

        return new Promise<void>((resolve) => {
            this.http
                .get(url)
                .pipe(
                    switchMap((config: any) => {
                        this.config = config as any;
                        return this.http.get(`${(this.config.isDockerDeployed ? this.config.apiEndpoint : this.config.nonDockerApiEndpoint)}/session/user/get`);
                    }),
                    first()
                )
                .subscribe((_) => resolve());
        });
    }

    public getConfiguration(): IConfiguration {
        return this.config;
    }
}
