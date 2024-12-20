import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { SearchMap } from '@common/src/public-api';
import { DataStoreService } from './data-store.service';

@Injectable({
    providedIn: 'root',
})
export class MenuStateService {
    private _mainMenuKey: BehaviorSubject<string> = new BehaviorSubject(null);
    private _subMenuKey: BehaviorSubject<string> = new BehaviorSubject(null);
    private _showSideBar: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private _sideMenuFilters: BehaviorSubject<SearchMap> = new BehaviorSubject(null);
    private _showMainMenu: BehaviorSubject<boolean> = new BehaviorSubject(true);
    private _showSubMenu: BehaviorSubject<boolean> = new BehaviorSubject(false);

    constructor(private dataStoreService: DataStoreService) {
    }

    public mainMenuKey: Observable<string> = this._mainMenuKey.asObservable();
    public subMenuKey: Observable<string> = this._subMenuKey.asObservable();
    public showSideBar: Observable<boolean> = this._showSideBar.asObservable();
    public sideMenuFilters: Observable<SearchMap> = this._sideMenuFilters.asObservable();
    public showMainMenu: Observable<boolean> = this._showMainMenu.asObservable();
    public showSubMenu: Observable<boolean> = this._showSubMenu.asObservable();

    public changeShowSideBar(data: boolean): void {
        this._showSideBar.next(data);        
    }

    public changeSideMenuFilters(data: SearchMap): void {
        this._sideMenuFilters.next(data);
        this.dataStoreService.push('sidebar-search-map', data).then(_ => _);
    }

    public changeShowMainMenu(data: boolean): void {
        this._showMainMenu.next(data);
        this.storeMenuState();
    }

    public changeShowSubMenu(data: boolean): void {
        this._showSubMenu.next(data);
        this.storeMenuState();
    }

    public changeMainMenuKey(data: string): void {
        this._mainMenuKey.next(data);
        this.storeMenuState();
    }

    public changeSubMenuKey(data: string): void {
        this._subMenuKey.next(data);
        this.storeMenuState();
    }

    public getSubMenuKey(): string {
        return this._subMenuKey.getValue();
    }

    public getMainMenuKey(): string {
        return this._mainMenuKey.getValue();
    }

    public getShowSubMenu(): boolean {
        return this._showMainMenu.getValue();
    }

    public getShowMainMenu(): boolean {
        return this._showMainMenu.getValue();
    }

    public storeMenuState(): void {
        const ms = {
            showMainMenu: this._showMainMenu.getValue(),
            showSubMenu: this._showSubMenu.getValue(),
            mainMenuKey: this._mainMenuKey.getValue(),
            subMenuKey: this._subMenuKey.getValue()
        };

        this.dataStoreService.push('menu-state', ms).then(_ => _);
    }

    public getCurrentMenuState(): any {
        return {
            showMainMenu: this._showMainMenu.getValue(),
            showSubMenu: this._showSubMenu.getValue(),
            mainMenuKey: this._mainMenuKey.getValue(),
            subMenuKey: this._subMenuKey.getValue()
        };
    }

    public clearMenuState(): void {
        this.changeSubMenuKey(null);
        this.changeMainMenuKey(null);
        this.changeShowMainMenu(null);
        this.changeShowSubMenu(null);
    }

    public hydrateMenuState(): void {
        this.dataStoreService.get('menu-state').then((state: any) => {
            if (state) {
                this.changeMainMenuKey(state.mainMenuKey);
                this.changeSubMenuKey(state.subMenuKey);
                this.changeShowMainMenu(state.showMainMenu);
                this.changeShowSubMenu(state.showSubMenu);
            }
        })
    }

    public hydrateSidebarMenuFilters(): void {
        this.dataStoreService.get('sidebar-search-map').then(f => this.changeSideMenuFilters(f));
    }
}
