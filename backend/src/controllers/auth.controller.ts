import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { TokenCookie } from '../cookies/token.cookie';
import { Catch, Post, Controller, Injectable, Validator, Get } from '../core/decorators';
import { Authorize } from '../core/decorators/authorize.decorator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';
import { Cookie } from '../core/decorators/cookie.decorator';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';
import { LoginMode } from '../models/enums/login-mode';
import { UserService, TokenService } from '../services';
import { IdValidator } from '../validators/id-validator';
import { SigninValidator } from '../validators/signin.validator';
import { ApiController } from './api.controller';

@Injectable()
@Controller('/auth')
export default class AuthController extends ApiController {
    constructor(private tokenService: TokenService, private userService: UserService) {
        super();
    }

    @Post('/signin')
    @Catch()
    @ModelBinder(['@FromHeader::Authorization::Basic'])
    @Validator(SigninValidator)
    @Cookie(TokenCookie)
    async signIn(mode: LoginMode, isoCode: string, userName: string, password: string): Promise<any> {
        const user = await this.userService.validateSgnIn(mode, isoCode, userName, password);

        if (user) {
            const token = await this.tokenService.generateJwtToken(mode, isoCode, userName);
            this.request.session.userID = user._id.toString();
            return this.Ok(token);
        } else {
            return this.NotFound();
        }
    }

    @Get('/token/xsrf')
    @Catch()
    @ModelBinder([])
    async xsrf(): Promise<any> {
        const token = await this.tokenService.generateXsrfToken();
        this.request.session.xsrf = token;
        this.response.setHeader('x-xsrf-token', token);

        return this.Ok();
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Post('/token/verify')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['@FromBody::token'])
    @Validator(IdValidator)
    async verify(token: string): Promise<any> {
        return this.Ok(await this.tokenService.verifyAndValidateToken(token));
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Post('/token/revoke')
    @Catch()
    @CookieValidator(TokenCookieValidator, true)
    @ModelBinder(['@FromHeader::Authorization::token'])
    @Validator(IdValidator)
    async revoke(token: string): Promise<any> {
        await this.tokenService.revokeToken(token);
        return this.Ok();
    }

    @Authorize(['admin', 'customer', 'staff'])
    @Post('/token/refresh')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['@FromHeader::Authorization::token'])
    @Validator(IdValidator)
    @Cookie(TokenCookie)
    async refresh(token: string): Promise<any> {
        const newToken = await this.tokenService.refresh(token);
        if (newToken) {
            return this.Ok(newToken);
        } else {
            return this.BadRequest();
        }
    }
}
