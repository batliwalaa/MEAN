import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { AvailableSlot } from '../types/available-slot';
import { DeliverySlotType } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class DeliverySlotsService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public getPanchshilDeliverySlots(from: Date, to: Date): Promise<any> {
        const key = `get_panchshil_delivery_slot`;
        return this.executeGet(key, `${this.baseUrl}/delivery/slots/panchshil/${from}/${to}`).toPromise();
    }

    public getVehicleDeliverySlots(from: Date, to: Date): Promise<any> {
        const key = `get_vehicle_delivery_slot`;
        return this.executeGet(
            key,
            `${this.baseUrl}/delivery/slots/vehicle/${from.getTime()}/${to.getTime()}`
        ).toPromise();
    }

    public async reserve(availableSlot: AvailableSlot): Promise<any> {
        const key = `reserve_delivery_slot`;
        return await this.executePost(key, `${this.baseUrl}/delivery/slots/reserve`, {
            key: availableSlot._id,
            deliverySlotType: availableSlot.deliverySlotType,
        }).toPromise();
    }
}
