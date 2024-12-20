import { Component, AfterViewInit, ViewChildren, QueryList, ViewChild, ElementRef, HostListener, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { filter, debounceTime, distinctUntilChanged, takeUntil, debounce } from 'rxjs/operators';

import { Product, BaseComponent, InfiniteScrollService, SearchService, DataStoreService, MenuStateService, WINDOW } from '@common/src/public-api';
import { ItemContainerComponent } from './child-components/item-container/item-container.component';

@Component({
    selector: 'ui-list-content',
    templateUrl: './list.content.component.html',
    styleUrls: ['./list.content.component.scss'],
})
export class ListContentComponent extends BaseComponent implements AfterViewInit {
    private _pageNumber: number;
    private _filterQuery: any;
    private _loading: boolean = false;
    private _hasMorePages: boolean = true;

    query: string;
    items: Array<Product>;
    metadata: any;
    showSidebar = false;
    @ViewChildren(ItemContainerComponent) containers: QueryList<ItemContainerComponent>;
    @ViewChild('listItems') listItems: ElementRef;

    private $windowWidth: Subject<any> = new Subject<any>();

    constructor(
        private infiniteScrollService: InfiniteScrollService,
        private serachService: SearchService,
        private activatedRoute: ActivatedRoute,
        menusStateService: MenuStateService,
        dataStoreService: DataStoreService,
        @Inject(WINDOW) window: any,
        router: Router,
    ) {
        super(router, window, menusStateService, dataStoreService);
    }

    ngAfterViewInit(): void {
        this.setPaddingLeft();
    }

    protected async init(): Promise<void> {
        this.activatedRoute.data.pipe(takeUntil(this.$destroy)).subscribe(data => {
            this._pageNumber = 1;
            this.metadata = data.metadata['Content'];
            this.items = data.listData;
            this.query = this.activatedRoute.snapshot.params['query'];
            
            const parseQuery = (query: any) => {
                return {
                    lob: query.lob,
                    types: query.types
                };
            };

            this.menuStateService.sideMenuFilters
                .pipe(
                    takeUntil(this.$destroy))
                .subscribe(sm => {
                    if (sm) {
                        this._pageNumber = 1;
                        this._filterQuery = sm;
                        const query = btoa(JSON.stringify(Object.assign(sm, parseQuery(JSON.parse(atob(this.query))))));
                        this.serachService.search(query, this._pageNumber++)
                            .pipe(takeUntil(this.$destroy))
                            .subscribe((data: Array<Product>) => {
                                this._hasMorePages = Array.isArray(data) && data.length > 0;
                                this.items = data;
                            });
                    }                
                });

            this.menuStateService.showSideBar
                .pipe(takeUntil(this.$destroy))
                .subscribe((value) => this.showSidebar = value);

            this.$windowWidth
                .pipe(                    
                    debounceTime(50),
                    distinctUntilChanged(),
                    takeUntil(this.$destroy))
                .subscribe((_) => this.setPaddingLeft());

            this.infiniteScrollService.onScrolledDown
                .pipe(
                    filter(() => this._hasMorePages),
                    debounce(() => interval(200)),
                    takeUntil(this.$destroy))
                .subscribe(() => {
                    if (!this._loading) {
                        this._loading = true;
                        const query = btoa(JSON.stringify(Object.assign(JSON.parse(atob(this.query)), this._filterQuery)));
                        this.serachService.search(query, ++this._pageNumber)
                            .pipe(takeUntil(this.$destroy))
                            .subscribe((data: Array<Product>) => {
                                this._hasMorePages = Array.isArray(data) && data.length > 0;
                                this.items = this.items.concat(data);
                                this._loading = false;
                            });
                    }
            });
        });
        
        return Promise.resolve();
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        this.$windowWidth.next(event.target.innerWidth);
    }

    private setPaddingLeft(): void {
        if (!this.listItems || !this.listItems.nativeElement) return;

        const maxAllowedWidth = this.listItems.nativeElement.offsetWidth - 40;
        let width = 0;

        this.containers.forEach((c) => {
            if (width + c.itemContainer.nativeElement.offsetWidth <= maxAllowedWidth) {
                width += c.itemContainer.nativeElement.offsetWidth;
            }
        });
    }
}
