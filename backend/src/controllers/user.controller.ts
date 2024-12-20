import { Catch, Post, Controller, Injectable, Validator, Get, Patch } from '../core/decorators';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { LoginMode } from '../models/enums/login-mode';
import { UserService, CryptoService } from '../services';
import { RecoveryValidator } from '../validators/recovery-validator';
import { NewAccountValidator } from '../validators/new-account.validator';
import { ApiController } from './api.controller';
import { ChangePasswordState, VerificationState, VerificationType } from '../models';
import { ChangePasswordValidator } from '../validators/change-password.validator';
import { ChangePasswordCookieValidator } from '../cookie-validators/change-password-cookie.validator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';
import { Authorize } from '../core/decorators/authorize.decorator';
import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { ActionResult } from '../core/action-results/action-result';
import { ProfileChangeProperty } from '../typings/custom';

@Injectable()
@Controller('/user')
export default class UserController extends ApiController {
    constructor(private userService: UserService, private cryptoService: CryptoService) {
        super();
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get('')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder([])
    async availablePoints(): Promise<ActionResult> {
        const result = await this.userService.getProfile(this.request.session.userID);

        return this.Ok(result);
    }

    @Post(['/validateusername'])
    @Catch()
    @ModelBinder(['@FromBody::mode', '@FromBody::isoCode', '@FromBody::userName'])
    @Validator(RecoveryValidator)
    async validateUsername(mode: LoginMode, isoCode: string, userName: string): Promise<any> {
        const user =
            mode === LoginMode.Email
                ? await this.userService.getUserByEmail(userName)
                : await this.userService.getUserByMobile(isoCode, userName);

        if (user) {
            let state = VerificationState.Verified;
            if (mode === LoginMode.Email) {
                state = !!user.emailVerified ? VerificationState.Verified : VerificationState.NotVerified;
            } else {
                state = !!user.mobileVerified ? VerificationState.Verified : VerificationState.NotVerified;
            }

            return this.Ok({ state });
        } else {
            return this.NotFound();
        }
    }

    @Post('/createnewaccount')
    @Catch()
    @ModelBinder([
        '@FromBody::firstName',
        '@FromBody::lastName',
        '@FromBody::email',
        '@FromBody::isoCode',
        '@FromBody::mobile',
        '@FromBody::password',
        '@FromBody::confirmPassword',
    ])
    @Validator(NewAccountValidator)
    async createNewAccount(
        firstName: string,
        lastName: string,
        email: string,
        isoCode: string,
        mobile: string,
        password: string
    ): Promise<any> {
        const hash = await this.cryptoService.hash(password);

        await this.userService.createNewAccount(
            {
                _id: null,
                firstName,
                lastName,
                emailId: email,
                country: 'India',
                mobile,
                password: hash,
                active: false,
                emailVerified: false,
                isoCode,
                failedLoginCount: 0,
                roles: ['customer'],
            },
            this.request.sessionID
        );

        return this.Ok();
    }

    @Post('/recovery')
    @Catch()
    @ModelBinder(['@FromBody::mode', '@FromBody::isoCode', '@FromBody::userName'])
    @Validator(RecoveryValidator)
    async recovery(mode: LoginMode, isoCode: string, userName: string): Promise<any> {
        const result = await this.userService.getRecoveryDetails(mode, isoCode, userName);

        if (result) {
            return this.Ok(result);
        } else {
            return this.NotFound();
        }
    }

    @Post('/changepassword')
    @Catch()
    @CookieValidator(ChangePasswordCookieValidator, true)
    @ModelBinder(['@FromBody::password', '@FromBody::confirmPassword'])
    @Validator(ChangePasswordValidator)
    async changePassword(password: string): Promise<any> {
        const state = await this.userService.changePassword(
            this.request.session.state.mode,
            this.request.session.state.isoCode,
            this.request.session.state.userName,
            password
        );
        return this.Ok({ state, clearCookie: state !== ChangePasswordState.PasswordInPreviousSet });
    }
    
    @Authorize(['customer'])
    @Patch('/profile/:type')
    @Catch()
    @ModelBinder([
        'type::string',
        '@FromBody::value'
    ])
    async changeProfile(
        type: ProfileChangeProperty,
        value: string
    ): Promise<any> {
        const valid = await this.userService.changeProfile(
            this.request.session.userID,
            type,
            value
        );
        return (valid ? this.Ok() : this.BadRequest());
    }

    @Authorize(['customer'])
    @Patch('/temp/profile/:type')
    @Catch()
    @ModelBinder([
        'type::string',
        '@FromBody::value'
    ])
    async tempProfileChange(
        type: ProfileChangeProperty,
        value: string
    ): Promise<any> {
        this.request.session.profileChange = { 
            type,
            value,
            userID: this.request.session.userID,
            isoCode: '+91'
         };

        await this.userService.sendProfileChangeOtp(
            this.request.sessionID,
            this.request.session.userID,
            VerificationType.ProfileChange,
            this.request.session.profileChange
        );

        return this.Accepted();
    }
}
