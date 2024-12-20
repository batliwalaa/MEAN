import { Router } from "@angular/router";
import { BaseComponent, DataStoreService, HistoryService, MenuStateService, RouteKeys } from "@common/src/public-api";

export class BaseAccountComponent extends BaseComponent {
    constructor (
        private historyService: HistoryService,
        router: Router,
        window: Window,
        menuStateService?: MenuStateService,
        dataStoreService?: DataStoreService
    ) {
        super(router, window, menuStateService, dataStoreService)
    }

    protected async init(): Promise<void> {
        this.historyService.clear();
        const bc = this.breadcrumbs;

        if (bc && bc.length > 0) {
            for (let i = 0; i < bc.length; i++) {
                if (bc[i].key) {
                    this.historyService.push({ url: RouteKeys[bc[i].key] });
                }
            }
        }

        await Promise.resolve();
    }
}
