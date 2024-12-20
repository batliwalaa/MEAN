import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent, WINDOW } from '@common/src/public-api';
import { TabItem } from '../../../../../types/tab-item';


@Component({
    selector: 'ui-tab-desktop-component',
    templateUrl: './tab-desktop.component.html',
    styleUrls: ['./tab-desktop.component.scss'],
})
export class TabDesktopComponent extends BaseComponent {
    private _tabs: Array<TabItem>;

    @Input() set tabs(value: Array<TabItem>) {
        if (value) {
            this._tabs = value;
            this.selectedTabItemIndex = this._tabs.findIndex((t) => t.selected);
        }
    }
    get tabs(): Array<TabItem> {
        return this._tabs;
    }
    @Output() tabSelected = new EventEmitter<number>();

    selectedTabItemIndex: number = 0;

    constructor(
        @Inject(WINDOW) window: Window,
        router: Router,
    ) {
        super(router, window);
    }

    async onNavigateClick(index): Promise<void> {
        this.tabSelected.emit(index);
    }
}
