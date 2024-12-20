import { DeliverySlotType } from './enums/delivery-slot-type';
import { SlotState } from './enums/slot-state';

export interface AvailableSlot {
    _id?: any;
    deliveryDate?: Date;
    startTime?: string;
    endTime?: string;
    availableSlots?: number;
    deliverySlotType?: DeliverySlotType;
    reserveStateExpiresIn?: number;
    selected?: boolean;
}
