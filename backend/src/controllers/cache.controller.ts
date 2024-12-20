import { Catch, Controller, Delete, Get, Injectable, ModelBinder } from '../core/decorators';
import { CacheManager } from '../cache/cache.manager';
import { ApiController } from './api.controller';
import { ActionResult } from '../core/action-results/action-result';
import isEmptyOrWhitespace from '../core/utils/is-empty-or-whitespace';

@Injectable()
@Controller('/admin/cache')
export default class CacheController extends ApiController {
    constructor(private cacheManager: CacheManager) {
        super();
    }

    @Delete('/:filter*?')
    @Catch()
    @ModelBinder(['filter'])
    async delete(filter: string): Promise<ActionResult> {
        await this.cacheManager.delete(isEmptyOrWhitespace(filter) ? '*' : filter);

        return this.Accepted();
    }

    @Get('/:key')
    @Catch()
    @ModelBinder(['key'])
    async get(key: string): Promise<ActionResult> {
        if (!isEmptyOrWhitespace(key)) {
            const data = await this.cacheManager.get(key);

            return this.Ok(data);
        }

        return this.BadRequest('Bad request');
    }
}
