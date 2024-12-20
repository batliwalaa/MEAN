import { Catch, Controller, Injectable, Get, Validator } from '../core/decorators';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { LanguageValidator } from '../validators/language.validator';
import { ApiController } from './api.controller';

@Injectable()
@Controller('/language')
export default class LanguageController extends ApiController {
    constructor() {
        super();
    }

    @Get(['/:language'])
    @Catch()
    @ModelBinder(['language::string'])
    @Validator(LanguageValidator)
    async get(language: string): Promise<any> {
        this.request.session.language = language;

        return this.Ok();
    }
}
