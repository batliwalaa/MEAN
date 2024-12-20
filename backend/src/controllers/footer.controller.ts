import { Catch, Controller, Get, Injectable } from '../core/decorators';
import { FooterService } from '../services/footer.service';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';

@Injectable()
@Controller('/footer')
export default class FooterController extends ApiController {
    constructor(private footerService: FooterService) {
        super();
    }

    @Get('/')
    @Catch()
    @ModelBinder([])
    async get(): Promise<any> {
        const result = await this.footerService.get();
        return this.Ok(result);
    }
}
