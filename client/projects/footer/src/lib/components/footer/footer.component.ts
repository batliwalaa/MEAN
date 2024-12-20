import { Component, Inject } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { FooterService } from '../../footer.service';
import { BaseComponent, WINDOW } from '@common/src/public-api';
import { Router } from '@angular/router';

@Component({
    selector: 'ui-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss'],
})
export class FooterComponent extends BaseComponent {
    public footerItems: Array<any>;
    public showChildFooter: boolean;
    public selectedFooter: string;

    constructor(
        private footerService: FooterService,
        @Inject(WINDOW) window: any,
        router: Router
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {
        this.footerService
            .get()
            .pipe(takeUntil(this.$destroy))
            .subscribe((items) => (this.footerItems = items));
        this.showChildFooter = false;
        this.selectedFooter = '';

        return Promise.resolve();
    }

    public setSelectedFooter(id: string): void {
        this.showChildFooter = true;

        this.selectedFooter = this.selectedFooter === id ? '' : id;
    }

    public isSelected(id: string): boolean {
        const selected = this.showChildFooter && this.selectedFooter === id;
        return selected;
    }
}
