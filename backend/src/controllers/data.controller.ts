import { Catch, Controller, Delete, Injectable, ModelBinder, Post } from '../core/decorators';
import { SeedDataService } from '../services/seed.data.services';
import { ApiController } from './api.controller';
import { ActionResult } from '../core/action-results/action-result';

@Injectable()
@Controller('/admin/data')
export default class DataController extends ApiController {
    constructor(private seedDataService: SeedDataService) {
        super();
    }

    @Post('/menu')
    @Catch()
    @ModelBinder([])
    async menu(): Promise<ActionResult> {
        await this.seedDataService.insertMenu();

        return this.Accepted();
    }

    @Post('/footer')
    @Catch()
    @ModelBinder([])
    async footer(): Promise<ActionResult> {
        await this.seedDataService.insertFooter();

        return this.Accepted();
    }

    @Post('/homepage')
    @Catch()
    @ModelBinder([])
    async homepage(): Promise<ActionResult> {
        await this.seedDataService.insertHomepage();

        return this.Accepted();
    }

    @Post('/pantry')
    @Catch()
    @ModelBinder([])
    async pantry(): Promise<ActionResult> {
        await this.seedDataService.insertPantry();

        return this.Accepted();
    }

    @Delete('/homepage')
    @Catch()
    @ModelBinder([])
    async deleteHomepage(): Promise<ActionResult> {
        await this.seedDataService.deleteHomepage();

        return this.Accepted();
    }

    @Delete('/pantry')
    @Catch()
    @ModelBinder([])
    async deletePantry(): Promise<ActionResult> {
        await this.seedDataService.deletePantry();

        return this.Accepted();
    }
}
