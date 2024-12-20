import { Catch, Controller, Get, Injectable, Validator } from '../core/decorators';
import { HomeService } from '../services/home.service';
import { ApiController } from './api.controller';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { HomeKeyValidator } from '../validators/home-key-validator';

@Injectable()
@Controller('/home')
export default class HomeController extends ApiController {
    constructor(private homeService: HomeService) {
        super();
    }

    @Get('/:key')
    @Catch()
    @ModelBinder(['key'])
    @Validator(HomeKeyValidator)
    async get(key: string): Promise<any> {
        const result = await this.homeService.get(key);

        return this.Ok(result);
    }
}
