import { Injectable } from '../core/decorators';
import { VehicleSlot } from '../models';
import VehicleSlotCollection from './collections/vehicle-slot.collection';
import { VehicleSlotModel } from './models/vehicle-slot.model';
import { SlotRepository } from './slot.repository';

@Injectable()
export class VehicleSlotRepository extends SlotRepository<VehicleSlotModel, VehicleSlot> {
    constructor() {
        super();
        this.slotCollection = VehicleSlotCollection();
    }

    public async saveMany(VehicleSlots: Array<VehicleSlot>): Promise<void> {
        await this.slotCollection.collection.insertMany(VehicleSlots, { bypassDocumentValidation: true });
    }
}
