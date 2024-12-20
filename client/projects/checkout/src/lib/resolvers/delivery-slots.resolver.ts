import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DeliverySlotsService, DeliverySlotType } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class DeliverySlotsResolver  {
    constructor(private deliverySlotsService: DeliverySlotsService) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const today = new Date(new Date(Date.now()).toDateString());
        const from = new Date(today.setDate(today.getDate()));
        const to = new Date(today.setDate(today.getDate() + 27));

        // TODO: check address for panchshil or other
        const deliveryType = DeliverySlotType.Vehicle;

        if (deliveryType === DeliverySlotType.Vehicle) {
            return await this.deliverySlotsService.getVehicleDeliverySlots(from, to);
        } else {
            return await this.deliverySlotsService.getPanchshilDeliverySlots(from, to);
        }
    }
}
