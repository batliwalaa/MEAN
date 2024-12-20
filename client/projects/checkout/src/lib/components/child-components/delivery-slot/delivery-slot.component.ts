import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import {
    BaseComponent,
    AvailableSlot,
    IConfiguration,
    ConfigService,
    DeliverySlotsService,
    HttpStatusCode,
    RouteKeys,
    WINDOW,
} from '@common/src/public-api';
import { TabItem } from '../../../types/tab-item';
import { TabDay } from '../../../types/tab-day';
import { SlotState } from '../../../types/slot-state';
import { from } from 'rxjs';
import { delay, first } from 'rxjs/operators';
import { CheckoutStateService } from '../../../services/checkout-state.service';

@Component({
    selector: 'ui-delivery-slot-component',
    templateUrl: './delivery-slot.component.html',
    styleUrls: ['./delivery-slot.component.scss'],
})
export class DeliverySlotComponent extends BaseComponent {
    private configuration: IConfiguration;

    metadata: any;
    slots: Array<AvailableSlot>;
    continue: boolean = false;
    tabs: Array<TabItem>;
    acceptance: any;
    selectedDate: Date;
    state: SlotState;

    constructor(
        private deliverySlotService: DeliverySlotsService,
        private checkoutStateService: CheckoutStateService,
        private activatedRoute: ActivatedRoute,
        @Inject(WINDOW) window: Window,
        router: Router,
        configService: ConfigService
    ) {
        super(router, window);
        this.configuration = configService.getConfiguration();
    }

    protected async init(): Promise<void> {
        this.metadata = this.activatedRoute.snapshot.data.metadata['Checkout'];
        this.slots = this.activatedRoute.snapshot.data.slots;
        const selectedSlot = this.slots.find((s) => s.selected);
        this.acceptance = this.activatedRoute.snapshot.data.metadata['Checkout'].acceptance;
        this.continue = !!selectedSlot;

        this.tabs = this.buildTabs(selectedSlot);
        this.setDays();

        if (selectedSlot) {
            this.checkoutStateService.selectedSlot = selectedSlot;
        }

        Promise.resolve();
    }

    public async onContinueClick(): Promise<void> {
        await this.checkoutStateService.saveState();
        this.router.navigate([RouteKeys.CheckoutPreview]);
    }

    public async onTabSelected(index: number): Promise<void> {
        this.tabs.forEach((s) => (s.selected = false));
        this.tabs[index].selected = true;
    }

    public async onDaySelected(date: Date): Promise<void> {
        this.selectedDate = date;
    }

    public async onSlotSelected(slot: AvailableSlot): Promise<void> {
        try {
            const previousSlot = this.slots.find((s) => s.selected);
            if (previousSlot) {
                previousSlot.selected = false;
            }

            slot.selected = true;
            await this.tokenService.xsrf();
            const result = await this.deliverySlotService.reserve(slot);
            this.checkoutStateService.selectedSlot = slot;
            this.continue = true;
        } catch (e) {
            if (e.status === HttpStatusCode.BadRequest) {
                slot.selected = false;
                this.state = SlotState.Failure;
                from([0])
                    .pipe(delay(3000), first())
                    .subscribe((_) => (this.state = null));
            } else if (e.status === HttpStatusCode.NotFound) {
                slot.selected = false;
                slot.availableSlots = 0;
                this.state = SlotState.NotAvailable;
                from([0])
                    .pipe(delay(3000), first())
                    .subscribe((_) => (this.state = null));
            } else {
                this.router.navigateByUrl(RouteKeys.ErrorFatal);
            }
        }
    }

    public get selectedTab(): TabItem {
        return this.tabs.find((t) => t.selected);
    }
    private buildTabs(selectedSlot?: AvailableSlot): Array<TabItem> {
        const tabs = new Array<TabItem>();
        const tempdate = new Date(new Date(Date.now()).toDateString());
        const selectedTime = selectedSlot ? new Date(selectedSlot.deliveryDate).getTime() : 0;

        let weekstart = new Date(tempdate.setDate(tempdate.getDate()));
        let weekend = new Date(tempdate.setDate(tempdate.getDate() + 6));
        this.selectedDate = selectedSlot ? new Date(selectedSlot.deliveryDate) : new Date(weekstart);

        for (let wk = 0; wk < 4; wk++) {
            tabs.push({
                label: `${weekstart.toLocaleString(this.configuration.language, {
                    month: 'short',
                })} ${weekstart.getDate()} - ${weekend.toLocaleString(this.configuration.language, {
                    month: 'short',
                })} ${weekend.getDate()}`,
                start: weekstart.getTime(),
                end: weekend.getTime(),
                selected: selectedSlot
                    ? selectedTime >= weekstart.getTime() && selectedTime <= weekend.getTime()
                    : wk === 0,
            });

            weekstart = new Date(tempdate.setDate(tempdate.getDate() + 1));
            weekend = new Date(tempdate.setDate(tempdate.getDate() + 6));
        }

        return tabs;
    }

    private setDays(): void {
        for (const currentTab of this.tabs) {
            const startDate = new Date(new Date(currentTab.start).toDateString());
            const endDate = new Date(new Date(currentTab.end).toDateString());
            currentTab.days = Array<TabDay>();

            while (startDate <= endDate) {
                currentTab.days.push({
                    day: startDate.getDate().toString(),
                    weekday: startDate.toLocaleString(this.configuration.language, { weekday: 'short' }),
                    selected: this.selectedDate.getTime() === startDate.getTime(),
                    date: new Date(startDate),
                    slots: this.slots.filter((s) => new Date(new Date(s.deliveryDate).toDateString()).getTime() === startDate.getTime()),
                });
                startDate.setDate(startDate.getDate() + 1);
            }
        }
    }
}
