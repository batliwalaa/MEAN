
import { Injectable } from '@angular/core';

import { MenuService } from '../services';

@Injectable({
    providedIn: 'root',
})
export class MenuResolver  {
    constructor(private menuService: MenuService) {}

    async resolve(): Promise<any> {
        return await this.menuService.getMainMenu().toPromise();
    }
}
