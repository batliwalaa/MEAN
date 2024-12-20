import { Catch, Controller, Get, Injectable } from '../core/decorators';
import { LoyaltyPointService } from '../services';
import { ApiController } from './api.controller';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ActionResult } from '../core/action-results/action-result';
import { Authorize } from '../core/decorators/authorize.decorator';
import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';

@Injectable()
@Controller('/loyalty/point')
export default class LoyaltyPointController extends ApiController {
    constructor(private loyaltyPointService: LoyaltyPointService) {
        super();
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get('/available')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder([])
    async availablePoints(): Promise<ActionResult> {
        const result = await this.loyaltyPointService.availablePoints(this.request.session.userID);

        return this.Ok(result);
    }
}
