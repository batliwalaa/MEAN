import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { MenuService } from '../services';
import { DataStoreService, MenuStateService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class SubMenuResolver  {
    constructor(
        private menuService: MenuService,
        private menuStateService: MenuStateService,
        private dataStoreService: DataStoreService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const key = await this.getKey(route);
        if (key) {
            return await this.menuService.getSubMenu(key).toPromise();
        }

        return Promise.resolve([]);
    }

    private async getKey(route: ActivatedRouteSnapshot): Promise<string> {
        let key = this.menuStateService.getMainMenuKey() ?? route.data.mainMenuKey;

        if (!key) {
            const menuState = this.menuStateService.getCurrentMenuState();
            
            if (!menuState) return null;

            if (menuState) {
                key = menuState.mainMenuKey;
            }
        }

        return key;
    }
}
