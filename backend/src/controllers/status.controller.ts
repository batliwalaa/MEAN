import { Controller, Get, Injectable } from '../core/decorators';
import { ApiController } from './api.controller';
import { ActionResult } from '../core/action-results/action-result';

@Injectable()
@Controller('/status')
export default class StatusController extends ApiController {
    @Get('')
    async get(): Promise<ActionResult> {
        return this.Ok({message: 'amreet-bazaar restful api health status ok'});
    }
}
