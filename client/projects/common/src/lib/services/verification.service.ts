import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { VerificationType } from '../types/verification-type';

@Injectable({
    providedIn: 'root',
})
export class VerificationService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public async verifyMobileOtp(
        verificationType: VerificationType,
        isoCode: string,
        mobile: string,
        otp: string
    ): Promise<void> {
        return await this.executePost('verify_otp_mobile', `${this.baseUrl}/verify/mobile/otp`, {
            verificationType,
            isoCode,
            mobile,
            code: otp,
        }).toPromise();
    }

    public async verifyEmailOtp(
        verificationType: VerificationType,
        email: string,
        otp: string
    ): Promise<void> {
        return await this.executePost('verify_otp_email', `${this.baseUrl}/verify/email/otp`, {
            verificationType,
            email,
            code: otp,
        }).toPromise();
    }

    public async resendMobileOtp(verificationType: VerificationType, isoCode: string, mobile: string): Promise<void> {
        return await this.executePost('verify_mobile_resend_otp', `${this.baseUrl}/verify/mobile/resend/otp`, {
            verificationType,
            isoCode,
            mobile,
        }).toPromise();
    }

    public async resendEmailOtp(verificationType: VerificationType, email: string, newEmailID: string): Promise<void> {
        return await this.executePost('verify_email_resend_otp', `${this.baseUrl}/verify/email/resend/otp`, {
            verificationType,
            email,
            newEmailID
        }).toPromise();
    }

    public async sendOtp(verificationType: VerificationType, isoCode: string, mobile: string): Promise<void> {
        return await this.executePost('verify_send_otp', `${this.baseUrl}/verify/send/otp`, {
            verificationType,
            isoCode,
            mobile,
        }).toPromise();
    }

    public async verifyEmail(hash: string): Promise<any> {
        return await this.executePost('verify_email', `${this.baseUrl}/verify/email`, { key: hash }).toPromise();
    }

    public async resendEmail(verificationType: VerificationType, email: string): Promise<void> {
        return await this.executePost('verify_resend_email', `${this.baseUrl}/verify/resend/email`, {
            verificationType,
            email,
        }).toPromise();
    }

    public async sendEmail(verificationType: VerificationType, email: string): Promise<void> {
        return await this.executePost('verify_send_email', `${this.baseUrl}/verify/send/email`, {
            verificationType,
            email,
        }).toPromise();
    }

    public async verifyReCaptcha(): Promise<any> {
        return await this.executePost('verify_recaptcha', `${this.baseUrl}/verify/recaptcha`, {}).toPromise();
    }

    public async profileChangeOtp(type: 'Mobile' | 'Email'): Promise<void> {
        await this.httpClient.post(`${this.baseUrl}/verify/send/profile/${type}`, {}).toPromise();
    }

    public async verifyProfileChangeOtp(otp: string, type: 'Mobile' | 'Email' = 'Mobile'): Promise<void> {
        await this.httpClient.post(`${this.baseUrl}/verify/otp/profile/${otp}/${type}`, {}).toPromise();
    }
}
