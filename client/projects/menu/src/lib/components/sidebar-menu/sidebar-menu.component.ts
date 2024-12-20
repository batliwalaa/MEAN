import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { BaseComponent, DataStoreService, SearchMap, MenuStateService, WINDOW } from '@common/src/public-api';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ui-menu-sidebar',
    templateUrl: 'sidebar-menu.component.html',
    styleUrls: ['sidebar-menu.component.scss'],
})
export class SidebarMenuComponent extends BaseComponent {
    private _searchMap: SearchMap = { subTypes: [], brands: [], filters: [] };

    sideBarItems: Array<any>;    
    previous: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        router: Router,
        @Inject(WINDOW) window: Window,
        dataStoreService: DataStoreService,
        menuStateService: MenuStateService
    ) {
        super(router, window, menuStateService, dataStoreService);
    }

    protected async init(): Promise<void> {
        

        this.previous = await this.dataStoreService.get('previous-page');
        this._searchMap = Object.assign(this._searchMap, JSON.parse(atob(this.activatedRoute.snapshot.params['query'])));
        
        this.menuStateService.changeSideMenuFilters(this._searchMap);

        this.activatedRoute.data.pipe(takeUntil(this.$destroy)).subscribe(data => {
            const sideBarItems = data.sidebar;
            if (sideBarItems) {
                this.sideBarItems = this.setSelectedOnSidebar(sideBarItems);
            }
        });

        this.menuStateService.sideMenuFilters.pipe(
            takeUntil(this.$destroy)
        ).subscribe(sm => {
            if (sm) {
                this._searchMap = sm;
                this.setSelectedOnSidebar(this.sideBarItems);
            }
        })

        return Promise.resolve();
    }

    hasSelected(items: Array<any>): boolean {
        return items.find((i) => !!i.selected);
    }

    public async setSelected(item: any): Promise<void> {
        item.selected = !item.selected;
        switch (item.key) {
            case 'subTypes':
                this.addRemoveToSearchMap(item, 'subTypes', (i) => i === item.label);
                break;
            case 'brands':
                this.addRemoveToSearchMap(item, 'brands', (i) => i === item.label);
                break;
            case 'sizePack':
            case 'speciality':
                this.addRemoveToSearchMap(item, 'filters', (i) =>  i.Value === item.label && i.Key === item.key, item.key);
                break;
        }

        this.menuStateService.changeSideMenuFilters(this._searchMap);
    }

    public async clearFilter(items: Array<any>): Promise<void> {
        if (Array.isArray(items) && items.length > 0) {
            const key = items[0].key;
            switch(key) {
                case 'subTypes':
                case 'brands':
                    this._searchMap[key] = [];
                    break;
                case 'speciality':
                case 'sizePack':
                    let index: number;
                    do {
                        index = this._searchMap.filters.findIndex(kvp => kvp.Key === key);
                        if (index >= 0) {
                            this._searchMap.filters.splice(index, 1);
                        }
                    } while (index >= 0);
                    break;

            }
            items.forEach((i) => (i.selected = false));
            this.menuStateService.changeSideMenuFilters(this._searchMap);
        }
    }

    private addRemoveToSearchMap(item: any, arrayKey: string, predicate: (i: any) => boolean, key: string = null): void {
        if (!item.selected) {
            const index = this._searchMap[arrayKey].findIndex(predicate);
            this._searchMap[arrayKey].splice(index, 1);
        } else {
            if (!key) {
                this._searchMap[arrayKey].push(item.label);
            } else {
                this._searchMap[arrayKey].push({ Key: key, Value: item.label });
            }
        }
    }

    private sortMenuItems(menuItems: Array<{ label: string }>): Array<{label: string}> {
        return menuItems.map(m => m.label).sort().map(i => { return { label: i}; });
    }

    private setSelectedOnSidebar(sideBarItems: Array<any>): Array<any> {
        const isSelected = (key: string, value: string): boolean => {
            let selected = false;
            switch (key) {
                case 'subTypes':
                case 'brands':
                    return this._searchMap[key].findIndex(v => v === value) !== -1;
                case 'sizePack':
                case 'speciality':
                    return this._searchMap['filters'].findIndex(v => v.Key === key && v.Value === value) !== -1;
            }
            return selected;
        };

        if (sideBarItems) {
            sideBarItems.forEach((sb) => {
                const key =  sb.key ? sb.key : 'subTypes';
                sb.menuItems = this.sortMenuItems(sb.menuItems);
                sb.menuItems.forEach((i: any) => {                    
                    i.selected = isSelected(key, i.label);
                    i.key = key;
                });
            });
        }

        return sideBarItems;
    }
}
