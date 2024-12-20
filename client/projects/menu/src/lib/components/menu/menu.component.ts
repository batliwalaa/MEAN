import { Component, Inject } from '@angular/core';
import { Router, ActivationEnd } from '@angular/router';
import { filter, first, takeUntil } from 'rxjs/operators';

import { BaseMenuComponent } from '../base-menu.component';
import { DataStoreService, MenuStateService, NavigationService, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-menu',
    templateUrl: 'menu.component.html',
    styleUrls: ['menu.component.scss'],
})
export class MenuComponent extends BaseMenuComponent {
    menuItems: Array<any> = [];
    subMenuKey: string;
    mainMenuKey: string;
    showMainMenu: boolean

    constructor (
        menuStateService: MenuStateService,
        dataStoreService: DataStoreService,
        @Inject(WINDOW) window: Window,
        router: Router,
        private navigationService: NavigationService
    ) {
        super(router, window, menuStateService, dataStoreService);
    }

    protected async init(): Promise<void> {
        this.router.events
            .pipe(
                filter((event) => {
                    return event instanceof ActivationEnd; 
                }),
                first(),
                takeUntil(this.$destroy),
            )
            .subscribe((event: any) => {
                const items = event.snapshot.data.menuData;
                if (Array.isArray(items) && items.length > 0) {
                    this.menuItems = items.filter(i => i.active === true).sort((a: any, b: any) => a.order - b.order);
                }
            });
        
            this.setMenuStateServiceObservables();

        return Promise.resolve();
    }

    public getMenuItemClass(item: any): string {
        return `${item.class} ${(item.label.toLowerCase() === this.mainMenuKey?.toLowerCase() ? 'selected' : '')}`;
    }

    public async menuItemClick(category: string, query: string): Promise<void> {
        await this.navigationService.navigateForCategory(query, category, this.currentPage);
    }

    private setMenuStateServiceObservables(): void {
        this.menuStateService.mainMenuKey.pipe(takeUntil(this.$destroy)).subscribe(k => this.mainMenuKey = k);
        this.menuStateService.subMenuKey.pipe(takeUntil(this.$destroy)).subscribe(k => this.subMenuKey = k);
        this.menuStateService.showMainMenu.pipe(takeUntil(this.$destroy)).subscribe(k => this.showMainMenu = k);
    }
}
