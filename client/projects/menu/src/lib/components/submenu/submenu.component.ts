import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

import { BaseMenuComponent } from '../base-menu.component';
import { DataStoreService, MenuStateService, NavigationService, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-submenu',
    templateUrl: 'submenu.component.html',
    styleUrls: ['submenu.component.scss'],
})
export class SubMenuComponent extends BaseMenuComponent {
    private _menuData: Array<any>;
    private _refresh: boolean = true;

    menuChildItems: Array<any> = [];
    categories: Array<{ label: string, url: string, selected: boolean }> = [];
    category: { label: string, url: string, selected: boolean };
    showDropMenu: boolean = false;
    @ViewChild('wrapper') subMenuScroller: ElementRef<any>;

    subMenuKey: string
    showSubMenu: boolean
    mainMenuKey: string;

    constructor(
        menuStateService: MenuStateService,
        dataStoreService: DataStoreService,
        router: Router,
        @Inject(WINDOW) window: Window,
        private activatedRoute: ActivatedRoute,
        private navigationService: NavigationService
    ) {
        super(router, window, menuStateService, dataStoreService);
    }

    protected async init(): Promise<void> {
        this.setMenuStateServiceObservables();

        this.activatedRoute.data.pipe(
            takeUntil(this.$destroy)
        ).subscribe(async data => {
            if (!this._refresh && this.isMobile) return;
            
            this._refresh = false;

            if (!this._menuData) {
                this._menuData = this.activatedRoute.snapshot.data.menuData;
            }
            this.menuChildItems = data.subMenu;
            this.categories = this.getCategories();
            this.category = this.categories.find(c => c.selected === true);

            await this.setSelectedSubMenuItem()
        });
        
        await Promise.resolve();
    }

    public async onDropMenuItemClick(category: { label: string, url: string, selected: boolean }): Promise<void> {
        this.showDropMenu = false;
        this._refresh = true;

        await this.navigationService.navigateForCategory(category.url, category.label, this.currentPage, false);
    }

    public getSelectedItem(): any {
        const selectedItem = this.menuChildItems.find(c => c.selected === true);

        return { item: selectedItem };
    }

    public getItem(item): any {
        return { item };
    }

    public async onMenuItemClick(item: any): Promise<void> {
        this.menuChildItems.forEach((ci: any) => ci.selected = false);
        this.showDropMenu = false;

        item.selected = true;       
        
        await this.navigationService.navigateForSubcategory(item.url, item.label)
        this.subMenuScroller.nativeElement.scrollLeft = 0;
    }

    public showMenuItem(item: any): boolean {
        return !this.isMobile || (item && item.selected !== true);
    }

    private getCategories(): Array<{ label: string, url: string, selected: boolean }> {
        if (!Array.isArray(this._menuData)) {
            return [];
        } else {
            return this._menuData
                        .filter(m => m.active === true)
                        .sort((a: any, b: any) => a.order - b.order)
                        .map(m => { 
                            return { 
                                label: m.label,
                                url: m.url,
                                selected: m.label?.toLowerCase() === this.mainMenuKey?.toLowerCase()
                            }; 
                        });
        }
    }

    private async setSelectedSubMenuItem(): Promise<void> {
        
        const selected: any = this.subMenuKey?.toLowerCase();
        if (selected) {
            const selectedItem = this.menuChildItems.find(c => c.label.toLowerCase() === selected);
            if (selectedItem) {
                selectedItem.selected = true;
            }
        }
    }

    private setMenuStateServiceObservables(): void {
        this.menuStateService.mainMenuKey.pipe(takeUntil(this.$destroy)).subscribe(v => this.mainMenuKey = v);
        this.menuStateService.subMenuKey.pipe(takeUntil(this.$destroy)).subscribe(v => this.subMenuKey = v);
        this.menuStateService.showSubMenu.pipe(takeUntil(this.$destroy)).subscribe(v => this.showSubMenu = v);
    }
}
