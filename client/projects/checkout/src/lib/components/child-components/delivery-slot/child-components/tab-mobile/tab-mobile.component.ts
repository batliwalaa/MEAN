import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';

import { BaseComponent, ConfigService, IConfiguration, WINDOW } from '@common/src/public-api';
import { TabItem } from '../../../../../types/tab-item';
import { TabDay } from '../../../../../types/tab-day';
import { Router } from '@angular/router';

@Component({
    selector: 'ui-tab-mobile-component',
    templateUrl: './tab-mobile.component.html',
    styleUrls: ['./tab-mobile.component.scss'],
})
export class TabMobileComponent extends BaseComponent {
    private _tabs: Array<TabItem>;
    private configuration: IConfiguration;

    month: string;
    selectedTabItemIndex: number = 0;

    @Input() set tabs(value: Array<TabItem>) {
        if (value) {
            this._tabs = value;
            this.selectedTabItemIndex = this._tabs.findIndex((t) => t.selected);
        }
    }
    get tabs(): Array<TabItem> {
        return this._tabs;
    }

    @Output() daySelected = new EventEmitter<Date>();

    constructor(
        configService: ConfigService,
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);

        this.configuration = configService.getConfiguration();
    }

    async onDayClick(item: TabDay): Promise<void> {
        for (const currentTab of this._tabs) {
            for (let day of currentTab.days) {
                day.selected = false;
            }
        }
        item.selected = true;

        this.daySelected.emit(item.date);
    }

    async onNavigateClick(direction: 'l' | 'r'): Promise<void> {
        this.selectedTabItemIndex += direction === 'l' ? -1 : 1;
        this.setMonth();

        await this.onDayClick(this._tabs[this.selectedTabItemIndex].days[0]);
    }

    selectedOrCurrentDayClass(currentDay: TabDay): string {
        if (currentDay.selected) {
            return 'current-day';
        } else if (currentDay.slots.findIndex((s) => s.selected) !== -1) {
            return 'selected-day';
        }

        return '';
    }

    private setMonth(): void {
        const selectedTab = this._tabs[this.selectedTabItemIndex];
        const startDate = new Date(selectedTab.start);
        const endDate = new Date(selectedTab.end);
        const endDateMonth = endDate.toLocaleString(this.configuration.language, { month: 'long' });

        this.month = startDate.toLocaleString(this.configuration.language, { month: 'long' });

        if (this.month !== endDateMonth) {
            this.month += ` - ${endDateMonth}`;
        }
    }
}
