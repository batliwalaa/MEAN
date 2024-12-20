import { Component, Input, Output, EventEmitter, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AvailableSlot, BaseComponent, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-slot-mobile-component',
    templateUrl: './slot-mobile.component.html',
    styleUrls: ['./slot-mobile.component.scss'],
})
export class SlotMobileComponent extends BaseComponent {
    @Input() slots: Array<AvailableSlot>;
    @Input() selectedDate: Date;
    @Output() slotSelected = new EventEmitter<AvailableSlot>();

    constructor(
        @Inject(WINDOW) window: Window,
        router: Router,
    ) {
        super(router, window);
    }

    public get selectedDateSlots(): Array<AvailableSlot> {
        let slots = new Array<AvailableSlot>();

        if (this.selectedDate && this.slots) {
            slots = this.slots.filter((s) => {
                const valid =
                new Date(new Date(s.deliveryDate).toDateString()).getTime() === new Date(this.selectedDate.toDateString()).getTime();
                return valid;
            });
        }

        return slots;
    }

    public async onSlotClick(slot: AvailableSlot): Promise<void> {
        this.slotSelected.emit(slot);
    }
}
