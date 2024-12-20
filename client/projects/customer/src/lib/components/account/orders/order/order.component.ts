import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { first, takeUntil } from "rxjs/operators";

import { DataStoreService, HistoryService, MenuStateService, WINDOW } from "@common/src/public-api";
import { BaseAccountComponent } from "../../base-account.component";

@Component({
    selector: 'ui-order-component',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent extends BaseAccountComponent {
    metadata: any;
    order: any;
    headerMetadata: any;
    slot: any;

    constructor(        
        router: Router,
        @Inject(WINDOW) window: Window,
        menuStateService: MenuStateService,
        dataStoreService: DataStoreService,
        historyService: HistoryService,
        private activatedRoute: ActivatedRoute
    ) {
        super(historyService, router, window, menuStateService, dataStoreService);
    }

    protected async init(): Promise<void> {
        this.activatedRoute.data.pipe(
            first(),
            takeUntil(this.$destroy),
        )
        .subscribe((data) => {
            this.metadata = data.metadata['AccountOrderDetail'];
            this.headerMetadata = this.metadata.header;
            this.order = data.orderResult.order;
            this.slot = data.orderResult.slot;
        });
        super.init();

        await Promise.resolve();
    }
}