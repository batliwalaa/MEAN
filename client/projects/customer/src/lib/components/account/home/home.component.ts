import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first, takeUntil } from "rxjs/operators";

import { BaseComponent, AccountService, WINDOW, ConfigService } from '@common/src/public-api';
import { interval } from "rxjs";

@Component({
    selector: 'ui-home-component',
    templateUrl: 'home.component.html',
    styleUrls: ['home.component.scss']
})
export class HomeComponent extends BaseComponent {
    metadata: any;
    private readonly _debugMode: boolean = false;

    constructor (
        @Inject(WINDOW) window: any,
        router: Router,
        private readonly activatedRoute: ActivatedRoute,
        private readonly accountService: AccountService,
        configService: ConfigService
    ) {
        super(router, window);

        this._debugMode = configService.getConfiguration().mode === 'debug';
    }

    showFeature(option: any): boolean {
        return this._debugMode || option.featureEnabled === undefined || !!option.featureEnabled;
    }

    protected async init(): Promise<void> {
        this.activatedRoute.data.pipe(
            first(),
            takeUntil(this.$destroy),
        )
        .subscribe((data) => {
            this.metadata = data.metadata['Account'];
        });

        return Promise.resolve();
    }

    public get options(): Array<any> {
        return this.metadata && this.metadata.options;
    }

    public async onTileClick(key: string): Promise<void> {
        await this.accountService.navigate(key, this.isMobile);
    }
}
