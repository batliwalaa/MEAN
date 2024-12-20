import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, NavigationService, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-non-content-header',
    templateUrl: './non-content-header.component.html',
    styleUrls: ['./non-content-header.component.scss'],
})
export class NonContentHeaderComponent extends BaseComponent {
    constructor(
        private navigationService: NavigationService,
        @Inject(WINDOW) window: any,
        router: Router
    ) {
        super(router, window);
    }
    
    public async onHomeClick(): Promise<void> {
        await this.navigationService.navigateHomeClick();
    }
}
