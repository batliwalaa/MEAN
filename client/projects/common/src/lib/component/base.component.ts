import { OnInit, OnDestroy, Directive } from '@angular/core';
import { Subject } from 'rxjs';

import { TokenService } from '../services/token.service';
import { ServiceLocator } from '../service.locator';
import { MenuStateService } from '../services/menu-state.service';
import { DataStoreService } from '../services/data-store.service';
import { Router, RouterState, RouterStateSnapshot } from '@angular/router';

@Directive()
export abstract class BaseComponent implements OnInit, OnDestroy {
    protected $destroy = new Subject<boolean>();
    protected tokenService: TokenService;
    protected currentPage: string;
    protected routerStateSnapshot: RouterStateSnapshot;

    protected routerState: RouterState;
    constructor(
        protected router: Router,
        protected window: Window,
        protected menuStateService?: MenuStateService,
        protected dataStoreService?: DataStoreService
    ) {
        this.tokenService = ServiceLocator.Injector.get(TokenService);
        this.routerState = router.routerState;
        this.routerStateSnapshot = router.routerState.snapshot;
    }

    async ngOnInit(): Promise<void> {
        this.currentPage = this.routerStateSnapshot.url;
        await this.hydrateMenuStateService();
        await this.init();
    }

    async ngOnDestroy(): Promise<void> {
        this.$destroy.next(true);
        this.$destroy.unsubscribe();
        await this.destroy();
    }

    public get isMobile(): boolean {
        const mediaQuery = this.window && this.window.matchMedia && this.window.matchMedia('(max-width: 767px)');
        return mediaQuery && mediaQuery.matches;
    }

    public get breadcrumbs(): Array<any> {
        return this['metadata'] && this['metadata'].breadcrumb;
    } 

    protected async init(): Promise<void> {
        return Promise.resolve();
    }

    protected async destroy(): Promise<void> {
        return Promise.resolve();
    }

    private async hydrateMenuStateService(): Promise<void> {
        if (!this.menuStateService || !this.dataStoreService) return;

        this.menuStateService.hydrateMenuState();
        this.menuStateService.hydrateSidebarMenuFilters();
    }
}
