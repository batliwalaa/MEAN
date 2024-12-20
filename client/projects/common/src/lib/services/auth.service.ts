import { Injectable } from '@angular/core';
import { from } from 'rxjs';
import { delay, first } from 'rxjs/operators';

import { User } from '../types/user';
import { DataStoreService } from './data-store.service';
import { TokenService } from './token.service';
import { AuthState } from './auth.state';
import { ConfigService } from './config.service';
import { IConfiguration } from '../types/configuration';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private _user: User;
    private _token: string;
    private _refresh: string;
    private _expires: any;
    private _configuration: IConfiguration;

    public get user(): User {
        return this._user;
    }

    constructor(
        private dataStoreService: DataStoreService,
        private tokenService: TokenService,
        private configService: ConfigService
    ) {}

    public async login(mode: string, isoCode: string, username: string, password: string): Promise<void> {
        const userToken = await this.tokenService.signin(mode, isoCode, username, password);

        if (userToken && userToken.token && userToken.refresh) {
            this._token = userToken.token;
            this._refresh = userToken.refresh;

            await this.setToken(userToken);

            await this.afterLoginOrRefreshOrVerification();
        }
    }

    public async logout(): Promise<void> {
        await this.tokenService.xsrf();
        await this.tokenService.revoke();
        this.clearToken();
    }

    public async initialize(): Promise<void> {
        this._configuration = this.configService.getConfiguration();
        this._user = { roles: [], authenticated: false };

        const userToken: any = await this.dataStoreService.get('user-token', false);
        if (userToken && userToken.token && userToken.refresh) {
            this._token = userToken.token;
            this._refresh = userToken.refresh;

            if (await this.verify()) {
                await this.afterLoginOrRefreshOrVerification();
            }
        }
    }

    private async clearToken(): Promise<void> {
        this._token = null;
        this._refresh = null;
        this._expires = null;
        this._user = { roles: [], authenticated: false };

        return await this.dataStoreService.push('user-token', null, false);
    }

    private async setToken(token: string): Promise<void> {
        return await this.dataStoreService.push('user-token', token, false);
    }

    private async afterLoginOrRefreshOrVerification(): Promise<void> {
        try {
            await this.validateTokenValues();
            await this.setTokenData();
            await this.setRefreshTokenTimer();
        } catch {
            this.clearToken();
        }
    }

    private async verify(): Promise<boolean> {
        let valid = true;
        try {
            await this.tokenService.xsrf();
            await this.tokenService.verify(this._token);
        } catch {
            try {
                await this.refreshToken();
            } catch {
                valid = false;
            }
        }
        if (!valid) {
            await this.clearToken();
        }
        return valid;
    }

    public async refreshToken(): Promise<void> {
        await this.tokenService.xsrf();
        const token = await this.tokenService.refresh();

        if (token && token.token && token.refresh) {
            this._refresh = token.refresh;
            this._token = token.token;

            await this.setToken(token);
        }
    }

    private async validateTokenValues(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                const tokenInfo = JSON.parse(atob(this._token.split('.')[1]));
                if (
                    tokenInfo.aud.includes(this._configuration.token.aud) &&
                    tokenInfo.iss.includes(this._configuration.token.iss)
                ) {
                    const now = Date.now();
                    if (Date.now() >= Number(tokenInfo.exp) * 1000) {
                        reject();
                    } else {
                        resolve();
                    }
                }
                reject();
            } catch {
                reject();
            }
        });
    }

    private async setTokenData(): Promise<void> {
        const tokenInfo = JSON.parse(atob(this._token.split('.')[1]));

        this._user = {
            authenticated: true,
            country: tokenInfo.country,
            emailId: tokenInfo.emailId,
            roles: tokenInfo.roles,
            firstName: tokenInfo.firstName,
            lastName: tokenInfo.lastName,
        };

        this._expires = Number(tokenInfo.exp);

        return Promise.resolve();
    }

    private async setRefreshTokenTimer(): Promise<void> {
        let value = (Number(this._expires) - Number(this._configuration.token.offset)) * 1000;
        from([0])
            .pipe(delay(new Date(value)), first())
            .subscribe(async (_) => {
                AuthState.Refreshing = true;
                await this.refreshToken();
                await this.afterLoginOrRefreshOrVerification();
            });
        AuthState.Refreshing = false;
    }
}
