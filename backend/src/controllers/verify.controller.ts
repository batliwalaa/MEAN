import { Catch, Controller, Injectable, Post, Validator } from '../core/decorators';
import { VerificationService, OtpVerifyService, UserService, VerifyRecaptchaService } from '../services';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';
import { VerificationState, VerificationType } from '../models';
import { IdValidator } from '../validators/id-validator';
import { ResendMobileOtpValidator } from '../validators/resend-mobile-otp-validator';
import { ResendEmailValidator } from '../validators/resend-email-validator';
import { OtpMobileVerificationValidator } from '../validators/otp-mobile-verification-validator';
import { ChangePasswordCookie } from '../cookies/change-password.cookie';
import { Cookie } from '../core/decorators/cookie.decorator';
import { OtpVerificationCookie } from '../cookies/otp-verification.cookie';
import { SendOtpResponseModifier } from '../modifiers/send-otp-response.modifier';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';
import { OtpVerificationCookieValidator } from '../cookie-validators/otp-verification-cookie.validator';
import { LoginMode } from '../models/enums/login-mode';
import { OtpVerificationResponseModifier } from '../modifiers/otp-verification-response.modifier';
import { EmailVerificationResponseModifier } from '../modifiers/email-verification-response.modifier';
import { Authorize } from '../core/decorators/authorize.decorator';
import { ActionResult } from '../core/action-results/action-result';
import { ProfileChangeProperty } from '../typings/custom';
import { ResendEmailOtpValidator } from '../validators/resend-email-otp-validator';
import { OtpEmailVerificationValidator } from '../validators/otp-email-verification.validator';

@Injectable()
@Controller('/verify')
export default class VerifyController extends ApiController {
    constructor(
        private verificationService: VerificationService,
        private otpVerifyService: OtpVerifyService,
        private userService: UserService,
        private verifyRecaptchaService: VerifyRecaptchaService
    ) {
        super();
    }

    @Post('/email')
    @Catch()
    @ModelBinder(['@FromBody::key'])
    @Validator(IdValidator)
    //@Cookie(ChangePasswordCookie, EmailVerificationResponseModifier)
    async emailVerification(key: string): Promise<any> {
        const result = await this.verificationService.verify(key);
        return this.Ok({ ...result, mode: LoginMode.Email, isoCode: null });
    }

    @Post('/mobile/otp')
    @Catch()
    //@CookieValidator(OtpVerificationCookieValidator, true)
    @ModelBinder(['@FromBody::verificationType', '@FromBody::isoCode', '@FromBody::mobile', '@FromBody::code'])
    @Validator(OtpMobileVerificationValidator)
    //@Cookie(ChangePasswordCookie, OtpVerificationResponseModifier)
    async otpMobileVerification(
        verificationType: VerificationType,
        isoCode: string,
        mobile: string,
        code: string
    ): Promise<any> {
        const state = await this.otpVerifyService.verify(
            this.request.sessionID,
            verificationType,
            code,
            isoCode,
            mobile,
            null,
            verificationType === VerificationType.ProfileChange ? this.request.session.profileChange : null
        );

        return this.verifyActionResult(state, { state, mode: LoginMode.Mobile, isoCode, userName: mobile, type: verificationType });
    }

    @Post('/email/otp')
    @Catch()
    //@CookieValidator(OtpVerificationCookieValidator, true)
    @ModelBinder(['@FromBody::verificationType', '@FromBody::email', '@FromBody::code'])
    @Validator(OtpEmailVerificationValidator)
    //@Cookie(ChangePasswordCookie, OtpVerificationResponseModifier)
    async otpEmailVerification(
        verificationType: VerificationType,
        email: string,
        code: string
    ): Promise<any> {
        const state = await this.otpVerifyService.verify(
            this.request.sessionID,
            verificationType,
            code,
            null,
            null,
            email,
            verificationType === VerificationType.ProfileChange ? this.request.session.profileChange : null
        );
        return this.verifyActionResult(state, { state, mode: LoginMode.Email, userName: email, type: verificationType });
    }

    @Post(['/mobile/resend/otp', '/send/otp'])
    @Catch()
    @ModelBinder(['@FromBody::verificationType', '@FromBody::isoCode', '@FromBody::mobile'])
    @Validator(ResendMobileOtpValidator)
    //@Cookie(OtpVerificationCookie, SendOtpResponseModifier)
    async resendMobileOtp(verificationType: VerificationType, isoCode: string, mobile: string): Promise<any> {
        await this.userService.sendMobileOtp(this.request.sessionID, verificationType, isoCode, mobile);

        return this.Ok({ sessionID: this.request.sessionID, type: verificationType, isoCode, mobile });
    }
    
    @Post(['/email/resend/otp'])
    @Catch()
    @ModelBinder(['@FromBody::verificationType', '@FromBody::email', '@FromBody::newEmailID'])
    @Validator(ResendEmailOtpValidator)
    //@Cookie(OtpVerificationCookie, SendOtpResponseModifier)
    async resendEmailOtp(
        verificationType: VerificationType,
        email: string,
        newEmailID?: string
    ): Promise<any> {
        await this.userService.sendEmailOtp(this.request.sessionID, verificationType, email, newEmailID);

        return this.Ok({ sessionID: this.request.sessionID, type: verificationType, email, newEmailID });
    }

    @Post(['/resend/email', '/send/email'])
    @Catch()
    @ModelBinder(['@FromBody::verificationType', '@FromBody::email'])
    @Validator(ResendEmailValidator)
    async resendEmail(verificationType: VerificationType, email: string): Promise<any> {
        await this.userService.sendEmail(this.request.sessionID, verificationType, email);

        return this.Ok();
    }

    @Post(['/recaptcha'])
    @Catch()
    @ModelBinder(['@FromHeader::x-recaptcha-token'])
    @Validator(IdValidator)
    async recaptcha(token: string): Promise<any> {
        let state: any = { state: 'RecaptchaVerificationSuccess' };

        if (process.env.RECAPTCHA_USE === 'true') {
            const result: any = await this.verifyRecaptchaService.verify(token);

            if (!result.success || result.score <= 0.5) {
                state = { state: 'RecaptchaVerificationFailure' };
            }
        }

        return this.Ok(state);
    }

    @Authorize(['customer'])
    @Post(['/send/profile/:type'])
    @Catch()
    @ModelBinder(['type::string'])
    //@Cookie(OtpVerificationCookie, SendOtpResponseModifier)
    async profileOtp(type: ProfileChangeProperty): Promise<any> {
        await this.userService.sendProfileChangeRequestOtp(this.request.sessionID, this.request.session.userID, type, VerificationType.ProfileChange);

        return this.Ok();
    }

    @Authorize(['customer'])
    @Post(['/otp/profile/:code/:type'])
    @Catch()
    //@CookieValidator(OtpVerificationCookieValidator, true)
    @ModelBinder(['code::string', 'type::string'])
    async verifyProfileOtp(code: string, type: ProfileChangeProperty): Promise<any> {
        const state = await this.otpVerifyService.verifyProfileChangeOtp(this.request.sessionID, this.request.session.userID, code, type);

        return this.verifyActionResult(state, { state });
    }

    private verifyActionResult(state: VerificationState, model: any): ActionResult {
        if (state === VerificationState.Verified) {
            return this.Ok(model);
        } else if (state === VerificationState.Expired) {
            return this.BadRequest({ state });
        } else if (state === VerificationState.NotFound) {
            return this.NotFound();
        }

        return this.BadRequest();
    }
}
