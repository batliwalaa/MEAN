import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { HttpService, ConfigService } from '@common/src/public-api';
import { ChangePasswordModel, INewCustomer } from '../models';
import { ProfileChangeProperty } from '../../../../typings/custom';

@Injectable({
    providedIn: 'root',
})
export class CustomerService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public async checkUserNameNotTaken(username: string): Promise<void> {
        await this.httpClient
            .post(`${this.baseUrl}/user/validateusername`, {
                username: username,
            })
            .toPromise();
    }

    public async createNewAccount(newCustomer: INewCustomer): Promise<any> {
        return await this.httpClient.post(`${this.baseUrl}/user/createnewaccount`, newCustomer).toPromise();
    }

    public async getPasswordRecoveryInfo(mode: string, isoCode: string, userName: string): Promise<any> {
        return await this.httpClient.post(`${this.baseUrl}/user/recovery`, { mode, isoCode, userName }).toPromise();
    }

    public async changePassword(model: ChangePasswordModel): Promise<any> {
        return await this.httpClient
            .post(`${this.baseUrl}/user/changepassword`, {
                password: model.password,
                confirmPassword: model.confirmPassword,
            })
            .toPromise();
    }

    public async getAccountInfo(): Promise<any> {
        return await this.httpClient.get(`${this.baseUrl}/user`).toPromise();
    }

    public async changeUserProfile(type: ProfileChangeProperty, value: string|number): Promise<any> {
        return this.httpClient.patch(`${this.baseUrl}/user/profile/${type}`, {
            value
        }).toPromise();
    }

    public async tempProfileChange(type: ProfileChangeProperty, value: string|number): Promise<any> {
        return this.httpClient.patch(`${this.baseUrl}/user/temp/profile/${type}`, {
            value
        }).toPromise();
    }
}
