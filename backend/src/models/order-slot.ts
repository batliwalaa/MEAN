import { DeliverySlotType } from "."

export interface  OrderSlot {
    _id: string;
    slotType: DeliverySlotType;
    deliveryDate: Date;
    startTime: string;
    endTime: string;
}