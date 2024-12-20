import { ChangeDetectionStrategy, Component, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { HistoryService } from "../../services/history.service";
import { BaseComponent } from "../base.component";
import { WINDOW } from '../../services/window.service';
import { Inject } from '@angular/core';

@Component({
    selector: 'ui-back-component',
    templateUrl: './back.component.html',
    styleUrls: ['./back.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackComponent extends BaseComponent {
    hasHistory: boolean;

    @Output() isVisible: EventEmitter<boolean> = new EventEmitter<boolean>();

    constructor(
        private historyService: HistoryService,
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    public async init(): Promise<void> {
        interval(500).pipe(takeUntil(this.$destroy)).subscribe(async _ => {
            this.hasHistory = await this.historyService.hasItems();
            this.isVisible.emit(this.hasHistory);
        });
    }

    public async onBackClick(): Promise<void> {
        const url = await this.historyService.pop();
        this.router.navigateByUrl(url);
    }
}
