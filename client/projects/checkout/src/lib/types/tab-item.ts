import { TabDay } from './tab-day';

export interface TabItem {
    label: string;
    start: number;
    end: number;
    selected: boolean;
    days?: Array<TabDay>;
}
