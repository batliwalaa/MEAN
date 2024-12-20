import { Catch, Controller, Get, Injectable, Validator } from '../core/decorators';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';
import { IdValidator } from '../validators/id-validator';
import { MediatR } from '../core/mediator/MediatR';
import { GetSellerByIdRequest } from '../cqrs';

@Injectable()
@Controller('/seller')
export default class ProductController extends ApiController {
    constructor() {
        super();
    }

    @Get('/:id')
    @Catch()
    @ModelBinder(['id::string'])
    @Validator(IdValidator)
    async getForID(id: string) {
        const result = await MediatR.send(new GetSellerByIdRequest(id));

        return this.Ok(result);
    }
}