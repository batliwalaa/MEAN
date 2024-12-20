import { Catch, Controller, Delete, Get, Injectable, Post, Validator } from '../core/decorators';
import { AddressService } from '../services/address.service';
import { ApiController } from './api.controller';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { IdValidator } from '../validators/id-validator';
import { ActionResult } from '../core/action-results/action-result';
import { Authorize } from '../core/decorators/authorize.decorator';
import { Address } from '../models';
import { AddressValidator } from '../validators/address.validator';
import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';

@Injectable()
@Controller('/address')
export default class AddressController extends ApiController {
    constructor(private addressService: AddressService) {
        super();
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get('/user')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder([])
    async getForUser(): Promise<ActionResult> {
        const result = await this.addressService.getForUser(this.request.session.userID);

        return this.Ok(result);
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get('/user/:id')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['id::string'])
    async get(id: string): Promise<ActionResult> {
        const result = await this.addressService.get(id);

        return this.Ok(result);
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Post(['/save'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['@FromBody::address'])
    @Validator(AddressValidator)
    async save(address: Address): Promise<ActionResult> {
        const result = await this.addressService.save({ ...address, userID: this.request.session.userID });

        return this.Ok({ _id: result });
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Delete('/:id')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['id'])
    @Validator(IdValidator)
    async delete(id: string): Promise<ActionResult> {
        await this.addressService.delete(id);

        return this.Accepted();
    }
}
