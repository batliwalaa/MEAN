import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";

import { BaseComponent, MenuStateService, WINDOW } from '@common/src/public-api';
import { interval } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'ui-account-component',
    templateUrl: './account.component.html',
    styleUrls: ['./account.component.scss']
})
export class AccountComponent extends BaseComponent {
    constructor (
        @Inject(WINDOW) window: any,
        router: Router,
        menuStateService: MenuStateService
    ) {
        super(router, window, menuStateService);
    }

    protected async init(): Promise<void> {
        interval(100).pipe(takeUntil(this.$destroy)).subscribe(async _ => {
            this.menuStateService.changeShowMainMenu(!this.isMobile);
            this.menuStateService.changeShowSubMenu(this.menuStateService.getShowMainMenu());
        });   
    }
}
