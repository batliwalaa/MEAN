import { Component, EventEmitter, Inject, Output } from '@angular/core';
import { BaseMenuComponent } from '../base-menu.component';
import { HamburgerMenuStateService } from '../../services';
import { Router, ActivationEnd, NavigationStart } from '@angular/router';
import { filter, first, takeUntil } from 'rxjs/operators';
import {
    ConfigService,
    MenuStateService,
    NavigationService,
    RouteKeys,
    WINDOW,
    AuthService,
    AccountService
} from '@common/src/public-api';
import { from } from 'rxjs';

@Component({
    selector: 'ui-burger-menu',
    templateUrl: './burger-menu.component.html',
    styleUrls: ['./burger-menu.component.scss'],
})
export class HamburgerMenuComponent extends BaseMenuComponent {
    menuItems: Array<any> = [];
    selectedMenu: string;
    metadata: any;
    showLanguagePopup: boolean;

    @Output() close: EventEmitter<void> = new EventEmitter<void>();
    constructor(
        menuStateService: MenuStateService,
        @Inject(WINDOW) window: Window,
        router: Router,
        private burgerMenuStateService: HamburgerMenuStateService,
        private navigationService: NavigationService,
        private configService: ConfigService,
        private authService: AuthService,
        private accountService: AccountService
    ) {
        super(router, window, menuStateService);
    }
    
    protected async init(): Promise<void> {
        if (this.router.events) {
            this.router.events
                .pipe(
                    filter((e) => (e instanceof ActivationEnd && e.snapshot.data && e.snapshot.data.burgerMenu) 
                        || (e instanceof NavigationStart && e.url)),
                    takeUntil(this.$destroy)                    
                )
                .subscribe((e: any) => {
                    if (e instanceof NavigationStart) {
                        this.currentPage = e.url;
                    } else {
                        this.menuItems = e.snapshot.data.burgerMenu;
                    }

                    if (e.snapshot && e.snapshot.data && e.snapshot.data.metadata && e.snapshot.data.metadata['BurgerMenu']) {
                        this.metadata = e.snapshot.data.metadata['BurgerMenu'];
                    }
                });
        }
        return Promise.resolve();
    }

    public get firstName(): string {
        return this.authService && this.authService.user && this.authService.user.firstName ? `, ${this.authService.user.firstName}` : '';
    }

    public get showChildMenu(): boolean {
        return this.burgerMenuStateService.showChildMenu;
    }

    public set showChildMenu(value: boolean) {
        this.burgerMenuStateService.showChildMenu = value;
    }

    public get showMenu(): boolean {
        return this.burgerMenuStateService.showMenu;
    }

    public set showMenu(value: boolean) {
        this.burgerMenuStateService.showMenu = value;
    }

    public get language(): string {
        return this.configService.getConfiguration().selectedLanguage;
    }

    public get authenticated(): boolean {
        return this.authService && this.authService.user && this.authService.user.authenticated;
    }

    public setSelectedMenu(item: any): void {
        if (item && item.childItems && item.childItems.length) {
            this.showChildMenu = true;
            this.selectedMenu = item.id;
        }
    }

    public isSelected(id: string): boolean {
        return this.showChildMenu && this.selectedMenu === id;
    }
    
    activeChildItems(childItems: Array<any>): Array<any> {
        return childItems.filter(c => c.active === true).sort((a: any, b: any) => a.order - b.order);
    }

    onClose(e: Event): void {
        if ((<HTMLElement>e.target).textContent.toLowerCase() !== 'back') {
            this.close.emit();
        }
    }

    public async onSubCategoryClick(item: any, category: string): Promise<void> {
        this.close.emit();
        const addToHistory = !this.currentPage.includes('product/list');
        await this.navigationService.navigateForSubcategory(item.url, item.label, category, addToHistory, this.currentPage);
    }

    public async onSignInClick(): Promise<void> {
        this.close.emit();
        this.router.navigateByUrl(RouteKeys.Signin);

        await Promise.resolve();
    }

    public async onSignOutClick(): Promise<void> {
        this.close.emit();
        from(this.authService.logout()).subscribe(async (_) => await this.navigationService.navigateHomeClick());
        await Promise.resolve();
    }

    public onLanguageChange(): void {
        this.showLanguagePopup = false;
    }

    public async onItemClick(key: string): Promise<void> {
        await this.accountService.navigate(key);

        this.close.emit();
    }

    public get accountOptions(): Array<any> {
        return this.metadata && this.metadata.accountOptions;
    }
}
