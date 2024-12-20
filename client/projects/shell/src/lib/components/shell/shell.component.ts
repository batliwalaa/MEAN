import { Component, ViewChild, ElementRef, Inject, ChangeDetectionStrategy } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';

import { BaseComponent, ConfigService, DataStoreService, GlobalisationService, NavigationService, ResourceKeys, RouteKeys, SearchStateService, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-shell',
    templateUrl: './shell.component.html',
    styleUrls: ['./shell.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
    
})
export class ShellComponent extends BaseComponent {
    @ViewChild('navTop') navTopRef: ElementRef;
    showContentTemplate: any = null;
    recaptchaUse: boolean;
    metadata: any;

    private nonContentRoutes = [
        'signin',
        'checkout',
        'error',
        'register',
        'verifyotp',
        'email/link/verifyemail',
        'forgotpassword',
        'email/link/passwordreset',
        'passwordreset',
        'admin',
        'notsupportedorientation'
    ];

    private filterNonContentRoutes = [
        'checkout/payment'
    ]

    constructor(
        private searchStateService: SearchStateService,
        private globalisationService: GlobalisationService,
        private navigationService: NavigationService,        
        @Inject(WINDOW) window: any,
        router: Router,
        configService: ConfigService,
        dataStoreService: DataStoreService
    ) {
        super(router, window, null, dataStoreService);
        this.recaptchaUse = configService.getConfiguration().recaptchaUse;
    }

    protected async init(): Promise<void> {
        this.router.events
            .pipe(
                filter((navigation: any) => navigation.url),
                takeUntil(this.$destroy),
            )
            .subscribe((navigation: NavigationStart) => {
                this.showContentTemplate =
                    this.nonContentRoutes.find((r) => navigation.url.toLowerCase().includes(r)) === undefined;
                if (!this.showContentTemplate) {
                    this.showContentTemplate = this.filterNonContentRoutes.find((r) => !navigation.url.toLowerCase().includes(r)) === undefined;
                }
                if (!this.showContentTemplate) {
                    this.searchStateService.clearQuickSearch$.next();
                }
            });

        this.globalisationService.get(ResourceKeys.Header).subscribe(md => this.metadata = md);
        // @ts-ignore
        if (this.window && this.window.DeviceOrientationEvent) {
            this.window.addEventListener('deviceorientation', async (event: DeviceOrientationEvent) => {
                if (
                    ((event.alpha === 0 && event.beta === 90 && event.gamma === -90) || 
                    (event.alpha === 0 && event.beta === 90 && event.gamma === 90))
                    && (this.isMobile)
                ) {
                    await this.navigationService.clear();
                    this.router.navigateByUrl(RouteKeys.NotSupportedOrientation);
                } else if (this.window.location.href.includes('notsupportedorientation')) {
                    await this.navigationService.navigateHomeClick();
                }
            });
        }
        return Promise.resolve();
    }

    scrollTop(): void {
        this.navTopRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
}
