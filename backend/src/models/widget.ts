import { WidgetItem } from './widget-item';

export interface Widget {
    title: string;
    footer: string;
    items: Array<WidgetItem>;
}
