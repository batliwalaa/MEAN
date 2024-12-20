import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { RouteKeys } from "../constants/route.keys";
import { DataStoreService } from "./data-store.service";
import { HistoryService } from "./history.service";
import { MenuStateService } from "./menu-state.service";
import { SearchStateService } from "./search-state.service";
import { WINDOW } from "./window.service";

@Injectable({
    providedIn: 'root'
})
export class NavigationService {
    constructor(
        private menuStateService: MenuStateService,
        private dataStoreService: DataStoreService,
        private searchStateService: SearchStateService,
        private historyService: HistoryService,
        private router: Router,
        @Inject(WINDOW) private window: any,
    ) {
    }

    public async navigateForCategory(query: any, category: string, currentPage: string, addToHistory: boolean = true): Promise<void> {
        this.searchStateService.clearQuickSearch$.next();
        const data = JSON.parse(query);

        const currentMenuState = this.menuStateService.getCurrentMenuState();
        
        this.menuStateService.changeShowMainMenu(!this.isMobileOrTablet);
        this.menuStateService.changeShowSubMenu(true);
        this.menuStateService.changeMainMenuKey(category);
        this.menuStateService.changeSubMenuKey(null);
        this.menuStateService.changeSideMenuFilters(null);

        await this.dataStoreService.push('sidebar-query', data);

        if (addToHistory === true) {
            await this.historyService.push({ url: currentPage, storeData: [ { Key: 'sidebar-query', Value: data }, { Key: 'menu-state', Value: currentMenuState}] });
        }

        this.router.navigateByUrl(`${RouteKeys.ProductList}${btoa(query)}`, { skipLocationChange: false, replaceUrl: true});
    }

    public async navigateForSubcategory(query: any, subMenuKey: string, mainMenuKey: string = null, addToHistory: boolean = false, currentPage: string = null): Promise<void> {
        this.searchStateService.clearQuickSearch$.next();

        const data = JSON.parse(query);
        const currentMenuState = this.menuStateService.getCurrentMenuState();

        this.menuStateService.changeSubMenuKey(subMenuKey);
        this.menuStateService.changeShowMainMenu(!this.isMobileOrTablet);
        this.menuStateService.changeMainMenuKey((mainMenuKey ? mainMenuKey : this.menuStateService.getMainMenuKey()));
        this.menuStateService.changeShowSubMenu(true);
        this.menuStateService.changeSideMenuFilters(null);

        await this.dataStoreService.push('sidebar-query', data);

        if (addToHistory === true) {
            await this.historyService.push({ url: currentPage, storeData: [ { Key: 'sidebar-query', Value: data }, { Key: 'menu-state', Value: currentMenuState}] });
        }

        this.router.navigateByUrl(`${RouteKeys.ProductList}${btoa(query)}`, { skipLocationChange: false, replaceUrl: true});
    }

    public async navigateForListItem(query: any, currentPage: string, itemId: string): Promise<void> {
        this.searchStateService.clearQuickSearch$.next();

        const data = JSON.parse(query);
        const currentMenuState = this.menuStateService.getCurrentMenuState();

        this.menuStateService.changeSideMenuFilters(null);
        
        await this.historyService.push({ url: currentPage, storeData: [ { Key: 'sidebar-query', Value: data }, { Key: 'menu-state', Value: currentMenuState}] });       

        this.router.navigateByUrl(`${RouteKeys.ProductDetail}${itemId}`, { skipLocationChange: false, replaceUrl: true});
    }

    public async navigateHomeClick(): Promise<void> {
        this.searchStateService.clearQuickSearch$.next();

        this.menuStateService.clearMenuState();
        this.menuStateService.changeSideMenuFilters(null);
        await this.historyService.clear();

        this.menuStateService.changeSubMenuKey(null);
        this.menuStateService.changeMainMenuKey(null);
        this.menuStateService.changeShowMainMenu(true);
        this.menuStateService.changeShowSubMenu(false);
        this.router.navigateByUrl(RouteKeys.Home);
    }

    public async navigateForCartClick(query: any, currentPage: string): Promise<void> {
        this.searchStateService.clearQuickSearch$.next();

        const data = JSON.parse(query);
        const currentMenuState = this.menuStateService.getCurrentMenuState();
        
        this.menuStateService.changeShowMainMenu(true);
        this.menuStateService.changeShowSubMenu(false);
        this.menuStateService.changeMainMenuKey(null);
        this.menuStateService.changeSideMenuFilters(null);

        await this.historyService.push({ url: currentPage, storeData: [ { Key: 'sidebar-query', Value: data }, { Key: 'menu-state', Value: currentMenuState}] });

        this.router.navigateByUrl(RouteKeys.ShoppingCart, { skipLocationChange: false, replaceUrl: true});
    }

    public async clear(): Promise<void> {
        this.searchStateService.clearQuickSearch$.next();

        this.menuStateService.clearMenuState();
        this.menuStateService.changeSideMenuFilters(null);

        await this.dataStoreService.push('sidebar-query', null);
        await this.historyService.clear();        
    }

    public async navigateForUrl(
        url: string,
        currentPage: string = '',
        addtoHistory: boolean = false,
        removeFromHistory = false
    ): Promise<void> {
        if (removeFromHistory) {
            this.historyService.pop();
        }
        if (addtoHistory) {
            await this.historyService.push({ url: currentPage });
        }
        this.router.navigateByUrl(url, { skipLocationChange: false, replaceUrl: true});

        await Promise.resolve();
    }

    public resetMenuState(): void {
        this.menuStateService.changeShowMainMenu(true);
        this.menuStateService.changeMainMenuKey(null);
        this.menuStateService.changeSubMenuKey(null);
        this.menuStateService.changeShowSubMenu(false);
    }

    public async back() : Promise<void> {
        const url = await this.historyService.pop();

        await this.router.navigateByUrl(url, { skipLocationChange: false, replaceUrl: true});
    }

    private get isMobileOrTablet(): boolean {
        const mediaQuery = this.window && this.window.matchMedia && this.window.matchMedia('(max-width: 767px)');
        return mediaQuery && mediaQuery.matches;
    }
}
