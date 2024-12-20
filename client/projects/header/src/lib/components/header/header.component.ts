import { Component, Inject, Input } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

import { HamburgerMenuStateService } from '@menu/src/public-api';
import {
    AuthService,
    BaseComponent,
    MenuStateService,
    DataStoreService,
    ShoppingCartStateService,
    NavigationService,
    WINDOW,
    ConfigService
} from '@common/src/public-api';
import { from } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
    selector: 'ui-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseComponent {
    private _query: string;

    @Input() metadata: any;
    
    showSearch: boolean;
    totalQuantity: number;
    showPopup: boolean;
    whatsapp: string;
    backComponentIsVisible: boolean;
    country: string;
    selectedLanguage: string;
    showLanguagePopup: boolean;

    constructor(
        private hamburgerMenuStateService: HamburgerMenuStateService,
        private shoppingcartStateService: ShoppingCartStateService,
        private navigationService: NavigationService,
        private deviceDetectorService: DeviceDetectorService,
        private authService: AuthService,
        configService: ConfigService,
        @Inject(WINDOW) window: any,
        router: Router,
        menuStateService: MenuStateService,
        dataStoreService: DataStoreService
    ) {
        super(router, window, menuStateService, dataStoreService);

        const configuration = configService.getConfiguration();
        this.country = configuration.country.toLowerCase();
        this.selectedLanguage = configuration.selectedLanguage;
    }

    public get authenticated(): boolean {
        return this.authService && this.authService.user && this.authService.user.authenticated;
    }

    public get firstName(): string {
        return this.authService && this.authService.user && this.authService.user.firstName;
    }

    public get showChildMenu(): boolean {
        return this.hamburgerMenuStateService.showChildMenu;
    }

    public set showChildMenu(value: boolean) {
        this.hamburgerMenuStateService.showChildMenu = value;
    }

    public get showMenu(): boolean {
        return this.hamburgerMenuStateService.showMenu;
    }

    public set showMenu(value: boolean) {
        this.hamburgerMenuStateService.showMenu = value;
    }

    public async cartClickHandler(): Promise<void> {
        await this.navigationService.navigateForCartClick(this._query ? atob(this._query) : "{}", this.currentPage);
    }

    public async onSignOut(): Promise<void> {
        from(this.authService.logout()).subscribe( async (_) => await this.navigationService.navigateHomeClick());
    }

    public async onHomeClick(): Promise<void> {
        await this.navigationService.navigateHomeClick();
    }

    public get isDesktop(): boolean {
        return this.deviceDetectorService.isDesktop();
    }

    protected async init(): Promise<void> {
        this.showSearch = false;
        this.showMenu = false;
        this.showChildMenu = false;
        this.whatsapp = "8482945574";

        this.shoppingcartStateService.cartStateChange
            .pipe(takeUntil(this.$destroy))
            .subscribe((_) => (this.totalQuantity = this.shoppingcartStateService.totalQuantity));

        this.router.events.pipe(
            filter((e: any) => {
                return e instanceof NavigationStart || (e.snapshot && e.snapshot.params['query']);
            }),
            takeUntil(this.$destroy)
        ).subscribe((e: any) => {
            if (e instanceof NavigationStart) {
                this.currentPage = e.url;
            } else {
                this._query = e.snapshot.params['query'];
            }
        });

        return Promise.resolve();
    }

    public onBackVisibilityChange(visible: boolean): void {
        this.backComponentIsVisible = visible;
    }
}
