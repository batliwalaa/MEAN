import { Injectable } from '../core/decorators';
import { Logging } from '../core/structured-logging/log-manager';
import { Logger } from '../core/structured-logging/logger';
import { OtpVerify, VerificationState, VerificationType } from '../models';
import { OtpVerifyRepository, UserRepository } from '../repositories';
import { SmsGatewayService } from './sms-gateway.service';
import generateRandomCharacters from '../utils/generate-random-characters';
import { ProfileChangeProperty } from '../typings/custom';
import { StringConstants } from '../constants/string-constants';
import { UserService } from '.';

@Injectable()
export class OtpVerifyService {
    private logger: Logger;

    constructor(
        private smsGatewayService: SmsGatewayService,
        private otpVerifyRepository: OtpVerifyRepository,
        private userRepository: UserRepository,
        private userService: UserService
    ) {
        this.logger = Logging.getLogger(`${this.constructor.name}`);
    }

    public async sendOtp(sessionID: string, isoCode: string, mobile: string, type: VerificationType): Promise<void> {
        const otp = await generateRandomCharacters(8);
        const number = `${isoCode.replace('+', '')}${mobile}`;
        const message = this.getOtpMessage(type, otp);
        try {
            let response = `process.env.SMS_GATEWAY_DEBUG: ${process.env.SMS_GATEWAY_DEBUG}`;

            if (process.env.SMS_GATEWAY_DEBUG !== 'true') {
                response = await this.smsGatewayService.sendOtp(message, number);
            }
            try {
                const expires = this.getExpires();
                await this.otpVerifyRepository.setResendFlag(isoCode, mobile, type);
                await this.otpVerifyRepository.save({
                    _id: null,
                    code: otp,
                    active: true,
                    dateSent: Date.now(),
                    isoCode,
                    mobile,
                    smsSentGatewayResponse: response,
                    smsSentStatus: 'Success',
                    verificationType: type,
                    expires,
                    sessionID,
                });
            } catch (e) {
                this.logger.error(
                    `Error: Send OTP ${type.toLowerCase()} success save`,
                    { action: 'sendOtp-otpVerifyRepository-save' },
                    e
                );
            }
        } catch (e) {
            this.logger.error(`Error: Send OTP ${type.toLowerCase()} failure`, { action: 'sendOtp' }, e);
            try {
                await this.otpVerifyRepository.save({
                    _id: null,
                    code: otp,
                    active: true,
                    dateSent: Date.now(),
                    isoCode,
                    mobile,
                    smsSentGatewayResponse: JSON.stringify(e),
                    smsSentStatus: 'Failure',
                    verificationType: type,
                    expires: Date.now() - 10000,
                    sessionID,
                });
            } catch (err) {
                this.logger.error(
                    `Error: Send OTP ${type.toLowerCase()} failure save`,
                    { action: 'sendOtp-otpVerifyRepository-save' },
                    e
                );
            }
        }
    }

    public async verify (
        sessionID: string,
        verificationType: VerificationType,
        code: string,
        isoCode?: string,
        mobile?: string,
        email?: string,
        profileChangeData?: { type: ProfileChangeProperty, value: any, userID: string }
    ): Promise<VerificationState> {
        let state: VerificationState = VerificationState.NotFound;

        const otpVerify: OtpVerify = await this.otpVerifyRepository.getByCode(code);

        if (otpVerify?.expires > Date.now()) {
            if (
                otpVerify &&
                otpVerify.sessionID === sessionID &&
                otpVerify.verificationType === verificationType &&
                (
                    (otpVerify.isoCode === isoCode && otpVerify.mobile === mobile) 
                    || 
                    (otpVerify.emailID === email)
                )
            ) {
                if (verificationType === VerificationType.ProfileChange && profileChangeData) {
                    await this.userService.changeProfile(
                        profileChangeData.userID,
                        profileChangeData.type,
                        profileChangeData.value
                    );
                }

                if (isoCode && mobile){
                    await this.userRepository.setMobileVerified(otpVerify.isoCode, otpVerify.mobile);
                } else{
                    await this.userRepository.setEmailVerified(otpVerify.emailID);
                }                
                await this.otpVerifyRepository.setVerifiedState(code);

                state = VerificationState.Verified;
            } else {
                state = VerificationState.NotFound;
            }
        } else {
            state = !otpVerify ? state : VerificationState.Expired;
        }

        return state;
    }

    public async verifyProfileChangeOtp(
        sessionID: string,
        userID: string,
        code: string,
        type: ProfileChangeProperty
    ): Promise<VerificationState> {
        const user = await this.userRepository.getUserById(userID);

        return await this.verify(
            sessionID,
            VerificationType.ProfileChange,
            code,
            (type === StringConstants.EMAIL ? null : user.isoCode),
            (type === StringConstants.EMAIL ? null : user.mobile),
            (type === StringConstants.EMAIL ? user.emailId : null)
        );
    }

    private getOtpMessage(type: VerificationType, otp: string): string {
        let msg = '';

        switch (type) {
            case VerificationType.NewAccountVerify:
                msg = `OTP to verify your mobile number, NEVER share this code, not even with Amreet Bazaar staff: ${otp}`;
                break;
            case VerificationType.ResetPassword:
                msg = `OTP for password reset, NEVER share this code, not even with Amreet Bazaar staff: ${otp}`;
                break;
            case VerificationType.ProfileChange:
                msg = `OTP for profile change, NEVER share this code, not even with Amreet Bazaar staff: ${otp}`;
                break;
        }

        return msg;
    }
    private getExpires(): number {
        return Date.now() + Number(process.env.OTP_VALIDITY) * 1000;
    }
}
