import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, DeliverySlotsService, WINDOW } from '@common/src/public-api';
import { AdminService } from '../services/admin.service';

@Component({
    selector: 'ui-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
})
export class AdminComponent extends BaseComponent {
    constructor(
        private adminService: AdminService,
        private deliverySlotsService: DeliverySlotsService,
        router: Router,
        @Inject(WINDOW) window: Window
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {}

    async onGenerateSlotsClick(): Promise<void> {
        await this.tokenService.xsrf();
        await this.adminService.generate();
    }

    async onGetPanchshilSlotsClick(): Promise<void> {
        const fromDate = new Date(2022, 5, 15);
        const toDate = new Date(2022, 6, 12);

        await this.deliverySlotsService.getPanchshilDeliverySlots(fromDate, toDate);
    }

    async onGetVehicleSlotsClick(): Promise<void> {
        const fromDate = new Date(2022, 5, 15);
        const toDate = new Date(2022, 6, 12);

        await this.deliverySlotsService.getVehicleDeliverySlots(fromDate, toDate);
    }
}
