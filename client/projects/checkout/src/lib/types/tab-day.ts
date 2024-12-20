import { AvailableSlot } from '@common/src/public-api';

export interface TabDay {
    day: string;
    weekday: string;
    selected: boolean;
    slots: Array<AvailableSlot>;
    date: Date;
}
