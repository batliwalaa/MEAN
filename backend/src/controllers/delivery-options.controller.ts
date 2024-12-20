import { Catch, Controller, Get, Injectable } from '../core/decorators';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';
import { Injector } from '../core/di/injector';
import { Authorize } from '../core/decorators/authorize.decorator';
import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';

import DeliveryOptionsConfiguration from '../singletons/delivery-options-configuration';

@Injectable()
@Controller('/delivery')
export default class DeliveryOptionsController extends ApiController {
    constructor() {
        super();
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get('/options')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder([])
    async get(): Promise<any> {
        const result = Injector.resolveSingleton<DeliveryOptionsConfiguration>(DeliveryOptionsConfiguration).options;

        return this.Ok(result);
    }
}
