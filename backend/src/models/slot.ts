import { SlotState } from './enums/slot-state';

export interface Slot {
    _id: any;
    deliveryDate: Date;
    createdDate: Date;
    startTime: string;
    endTime: string;
    slotNo: string;
    shoppingCartID: string;
    orderID?: string;
    slotState: SlotState;
    staffId?: string;
    actualStartTime?: string;
    actualEndTime?: string;
    test?: boolean;
    modifiedDate: Date;
    createdBy: string;
    modifiedBy: string;
    sessionID?: string;
    reserveStateExpiresIn?: number;
}
