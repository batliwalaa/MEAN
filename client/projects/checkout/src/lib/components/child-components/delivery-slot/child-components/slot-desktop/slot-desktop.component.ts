import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AvailableSlot, BaseComponent, WINDOW } from '@common/src/public-api';
import { from } from 'rxjs';
import { map, mergeAll, toArray } from 'rxjs/operators';
import { TabItem } from '../../../../../types/tab-item';

@Component({
    selector: 'ui-slot-desktop-component',
    templateUrl: './slot-desktop.component.html',
    styleUrls: ['./slot-desktop.component.scss'],
})
export class SlotDesktopComponent extends BaseComponent {
    private _tab: TabItem;

    slotWeekItems: Array<{ label: string; slots?: Array<AvailableSlot>; key: number }>;

    @Input() slots: Array<AvailableSlot>;
    @Input() set tab(value: TabItem) {
        if (value) {
            this._tab = value;
            this.initialiseSlots();
        }
    }
    get tab(): TabItem {
        return this._tab;
    }
    @Output() slotSelected = new EventEmitter<AvailableSlot>();

    constructor(
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    public async onSlotClick(slot: AvailableSlot): Promise<void> {
        this.slotSelected.emit(slot);
    }

    private initialiseSlots(): void {
        this.slotWeekItems = [];

        const tabItem = this._tab;

        if (tabItem) {
            tabItem.days[0].slots.map((s) =>
                this.slotWeekItems.push({
                    key: Number(s.startTime) + Number(s.endTime),
                    label: `${s.startTime}:00 - ${s.endTime}:00`,
                })
            );
            from(tabItem.days)
                .pipe(
                    map((d) => d.slots),
                    mergeAll(),
                    toArray()
                )
                .subscribe((slots) => {
                    this.slotWeekItems.forEach(
                        (wi) =>
                            (wi.slots = slots
                                .filter((s) => Number(s.startTime) + Number(s.endTime) === wi.key)
                                .sort(this.sort))
                    );
                });
        }
    }

    private sort(a: AvailableSlot, b: AvailableSlot): number {
        const aDeliveryTime = new Date(a.deliveryDate).getTime();
        const bDeliveryTime = new Date(b.deliveryDate).getTime();
        if (aDeliveryTime < bDeliveryTime) return -1;
        if (aDeliveryTime > bDeliveryTime) return 1;

        return 0;
    }
}
