export interface IDeliveryOptions {
    freeDeliveryMinOrderValue: number;
    slotsInAdvance: number;
    vehicleSlotStartTime: number;
    vehicleSlotEndTime: number;
    vehicleSlotSize: number;
    vehicleDeliveryPerSlot: number;
    panchshilDeliveryPerSlot: number;
    panchshilDeliveryResourcePerSlot: number;
    panchshilSlotStartTime: number;
    panchshilSlotEndTime: number;
    panchshilSlotSize: number;
    deliverySlotsUnavailableInHours: number;
}
