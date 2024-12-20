import { AfterViewInit, Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent, DataStoreService, RouteKeys, SearchMap, SearchStateService, WINDOW } from '@common/src/public-api';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ui-quick-search',
    templateUrl: './quick-search.component.html',
    styleUrls: ['./quick-search.component.scss'],
})
export class QuickSearchComponent extends BaseComponent implements AfterViewInit {
    searchTerm: string;

    @Input() metadata: any;
    @ViewChild('search') searchInput: ElementRef<HTMLInputElement>;
    
    constructor(
        dataStoreService: DataStoreService,
        @Inject(WINDOW) window: any,
        router: Router,        
        private searchStateService: SearchStateService
    ) {
        super(router, window, null, dataStoreService);
    }

    async ngAfterViewInit(): Promise<void> {
        if (this.searchInput) {
            fromEvent(this.searchInput.nativeElement, 'keyup')
            .pipe(
                filter((event: KeyboardEvent) => event.key === 'Enter'),
                takeUntil(this.$destroy)
            ).subscribe(_ => this.onSearchClick());
        }
    }

    protected async init(): Promise<void> {
        this.searchStateService.clearQuickSearch$
            .pipe(
                takeUntil(this.$destroy)
            ). subscribe(() => this.searchTerm = '');
    }

    async onSearchClick(): Promise<void> {
        if (!!this.searchTerm && this.searchTerm.length > 2) {
            const query: SearchMap = { searchString: this.searchTerm };            
            await this.dataStoreService.push('sidebar-query', query);
            this.router.navigateByUrl(`${RouteKeys.ProductList}${btoa(JSON.stringify(query))}`);
        }
    }
}
