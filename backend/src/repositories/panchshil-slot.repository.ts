import { Injectable } from '../core/decorators';
import { PanchshilSlot } from '../models';
import PanchshilSlotCollection from './collections/panchshil-slot.collection';
import { PanchshilSlotModel } from './models/panchshil-slot.model';
import { SlotRepository } from './slot.repository';

@Injectable()
export class PanchshilSlotRepository extends SlotRepository<PanchshilSlotModel, PanchshilSlot> {
    constructor() {
        super();
        this.slotCollection = PanchshilSlotCollection();
    }

    public async saveMany(panchshilSlots: Array<PanchshilSlot>): Promise<void> {
        await this.slotCollection.collection.insertMany(panchshilSlots, { bypassDocumentValidation: true });
    }
}
