import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { MenuService } from '../services';
import { DataStoreService, MenuStateService } from '@common/src/public-api';
import { takeUntil } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class SidebarResolver  {
    constructor(
        private menuService: MenuService,
        private menuStateService: MenuStateService,
        private dataStoreService: DataStoreService
    ) {}

    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        const sideBarQuery = await this.dataStoreService.get('sidebar-query');
        let sideBarItems: any;

        if (sideBarQuery) {
            sideBarItems = await this.menuService.getProductTypeSidebar(btoa(JSON.stringify(sideBarQuery))).toPromise();
        } else {
            const key = this.menuStateService.getSubMenuKey() ?? route.data.mainMenuKey;
            sideBarItems = await this.menuService.getSidebar(key).toPromise();
        }
        this.menuStateService.changeShowSideBar(!!sideBarItems);

        return sideBarItems;
    }
}
