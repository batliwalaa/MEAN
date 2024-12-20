import { DeliverySlotType } from '@common/src/public-api';

export interface AvailableSlot {
    _id: string;
    deliveryDate: Date;
    startTime: number;
    endTime: number;
    availableSlots: number;
    selected: boolean;
    deliverySlotType: DeliverySlotType;
}
