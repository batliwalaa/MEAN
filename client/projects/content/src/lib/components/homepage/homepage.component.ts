import { Component, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { WINDOW, DataStoreService, RouteKeys, BaseComponent, NavigationService, MenuStateService } from '@common/src/public-api';

@Component({
    selector: 'ui-homepage',
    templateUrl: './homepage.component.html',
    styleUrls: ['./homepage.component.scss'],
})
export class HomePageComponent extends BaseComponent {
    homePageData: any;

    @HostListener('window:resize', [])
    onResize(): void {
        this.setWidgetWidth();
    }

    constructor(
        @Inject(WINDOW) window: any,
        router: Router,
        dataStoreService: DataStoreService,
        menuStateService: MenuStateService,
        private activatedRoute: ActivatedRoute,        
        private titleService: Title,
        private metaService: Meta,
        private navigationService: NavigationService
    ) {
        super(router, window, menuStateService, dataStoreService)
        this.menuStateService.changeShowMainMenu(true);
    }

    protected async init(): Promise<void> {
        if (this.activatedRoute && this.activatedRoute.snapshot) {
            this.homePageData = this.activatedRoute.snapshot.data.homeData;
            this.setWidgetWidth();

            this.titleService.setTitle('home');
            this.metaService.addTag({
                name: 'description',
                content: 'home page content',
            });
        }

        await Promise.resolve();
    }

    public async onWidgetItemClick(query: any): Promise<void> {
        const data = JSON.parse(query);        
        await this.navigationService.navigateForSubcategory(query, data.types[0], data.category, true);
    }

    private setWidgetWidth(): void {
        if (this.homePageData && this.homePageData.sections) {
            this.homePageData.sections.forEach((s) =>
                s.widgets.forEach((w) => (w.width = this.getWidgetItemWidth(w.itemsPerRow)))
            );
        }
    }

    private getWidgetItemWidth(itemsPerRow: number): number {
        if (this.isMobile && itemsPerRow !== 1) {
            return 100 / (itemsPerRow / 2);
        }

        return 100 / itemsPerRow;
    }
}
