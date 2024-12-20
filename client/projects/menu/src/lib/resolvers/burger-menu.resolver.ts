import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { MenuService } from '../services';
import { MenuStateService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class BurgerMenuResolver  {
    constructor(private menuService: MenuService, private menuStateService: MenuStateService) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const key = this.menuStateService.getMainMenuKey() ?? route.data.mainMenuKey;

        return await this.menuService.getBurgerMenu(key).toPromise();
    }
}
