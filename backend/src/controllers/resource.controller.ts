import { Catch, Controller, Injectable, Get } from '../core/decorators';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';
import { ResourceService } from '../services';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';

@Injectable()
@Controller('/resource')
export default class ResourceController extends ApiController {
    constructor(private resourceService: ResourceService) {
        super();
    }

    @Get(['/:key'])
    @Catch()
    @ModelBinder(['key::string'])
    async get(key: string): Promise<any> {
        if (isEmptyOrWhitespace(key)) {
            return this.BadRequest();
        }

        const language = this.request.session.language || 'en';
        const resource: any = await this.resourceService.get(key, language);

        if (resource) {
            return this.Ok(resource._doc.value);
        }
        
        return this.BadRequest();
    }
}
