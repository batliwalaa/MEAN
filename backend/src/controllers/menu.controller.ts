import { Catch, Get, Controller, Injectable, Validator } from '../core/decorators';
import { MenuService } from '../services/menu.service';
import { MenuValidator } from '../validators/menu.validator';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';

@Injectable()
@Controller('/menu')
export default class MenuController extends ApiController {
    constructor(private menuService: MenuService) {
        super();
    }

    @Get('/:key/:device')
    @Catch()
    @ModelBinder(['key', 'device'])
    @Validator(MenuValidator)
    async getByKeyAndDevice(key: string, device: string): Promise<any> {
        const result = await this.menuService.get(key, device);

        return this.Ok(result);
    }

    @Get('/:key/submenu/:device')
    @Catch()
    @ModelBinder(['key', 'device'])
    @Validator(MenuValidator)
    async getSubmenuByKeyAndDevice(key: string, device: string): Promise<any> {
        const result = await this.menuService.get(key, device);

        return this.Ok(result);
    }

    @Get('/:key/submenu/sidebar/:device')
    @Catch()
    @ModelBinder(['key', 'device'])
    @Validator(MenuValidator)
    async getSidebarForSubmenuByKeyAndDevice(key: string, device: string): Promise<any> {
        const result = await this.menuService.get(key, device, true);

        return this.Ok(result);
    }

    @Get('/:key')
    @Catch()
    @ModelBinder(['key'])
    @Validator(MenuValidator)
    async getProductSidebar(key: string): Promise<any> {
        const result = await this.menuService.getProductSidebar(key);

        return this.Ok(result);
    }
}
