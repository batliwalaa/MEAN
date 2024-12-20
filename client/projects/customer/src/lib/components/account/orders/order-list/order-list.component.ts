import { Component, Inject } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { interval } from "rxjs";
import { debounce, filter, first, takeUntil } from "rxjs/operators";

import { DataStoreService, InfiniteScrollService, MenuStateService, WINDOW, OrderService, HistoryService, Order } from "@common/src/public-api";
import { OrderFilterService } from '../../../../services/order-filter.service';
import { BaseAccountComponent } from "../../base-account.component";

@Component({
    selector: 'ui-order-list-component',
    templateUrl: 'order-list.component.html',
    styleUrls: ['order-list.component.scss']
})
export class OrderListComponent extends BaseAccountComponent {
    private _periodOptions: Array<{ key: string, value: string}>;
    private _pageNumber: number;
    private _loading: boolean = false;
    private _hasMorePages: boolean = true;

    metadata: any;
    selectedPeriod: string;
    showPeriodDropdown: boolean = false;
    filteredOrders: Array<any>;
    count: number;
    showDetail: boolean = false;
    slots: Array<any>;
    

    constructor(
        router: Router,
        @Inject(WINDOW) window: Window,
        menuStateService: MenuStateService,
        dataStoreService: DataStoreService,
        historyService: HistoryService,
        private orderService: OrderService,        
        private orderFilterService: OrderFilterService,
        private infiniteScrollService: InfiniteScrollService,
        private activatedRoute: ActivatedRoute
    ) {
        super(historyService, router, window, menuStateService, dataStoreService);
    }

    protected async init(): Promise<void> {
        this._pageNumber = 1;
        this.activatedRoute.data.pipe(
            first(),
            takeUntil(this.$destroy),
        )
        .subscribe((data) => {
            this.metadata = data.metadata['AccountOrders'];
            this._periodOptions = this.metadata.periodOptions;
            this.slots = data.orderList.slots;
            this.filteredOrders = data.orderList.orders.items;          
            this.count = data.orderList.orders.count;
            this._hasMorePages = Array.isArray(data.orderList.orders.items) && data.orderList.orders.items.length > 0;
        });

        this.infiniteScrollService.onScrolledDown
                .pipe(
                    filter(() => this._hasMorePages),
                    debounce(() => interval(200)),
                    takeUntil(this.$destroy))
                .subscribe(() => {
                    if (!this._loading) {
                        this._loading = true;
                        const filter = this.orderFilterService.getFilter(this.selectedPeriod);
                        this._pageNumber++;
                        this.search(filter);
                    }
            });

        this.selectedPeriod = await this.dataStoreService.get('order-filter') ?? 'last 30 days';
        super.init();

        await Promise.resolve();
    }

    public get periodOptions(): Array<any> {
        return this._periodOptions;
    }

    public get breadcrumbs(): Array<any> {
        return this.metadata && this.metadata.breadcrumb;
    } 

    public async onPeriodOptionClick(option: any): Promise<void> {
        this._pageNumber = 1;
        this.selectedPeriod = option.value;
        await this.dataStoreService.push('order-filter', option.key);
        const filter = this.orderFilterService.getFilter(option.key);
        this.search(filter, true);
    }

    public wrapOrder(o: any): any {
        return { order: o };
    }

    public async onShowDetail(show: boolean): Promise<void> {
        this.showDetail = show;
    }

    public getSlot(slotId: string): any {    
        return this.slots.find(s => s._id === slotId);
      } 

    private search(filter: { from: number, to: number }, clear: boolean = false): void {
        this.orderService.search(this._pageNumber++, filter.from, filter.to)
            .pipe(takeUntil(this.$destroy))
            .subscribe((result: any) => {
                this._hasMorePages = 
                    result.orders && Array.isArray(result.orders.items) && result.orders.items.length > 0;
                
                if (clear) {
                    this.filteredOrders = [];
                }
                
                if(this._hasMorePages) {
                    this.filteredOrders = this.filteredOrders.concat(result.orders.items);
                }
                
                this.count = result.count
                this._loading = false;
            });
    }
}
