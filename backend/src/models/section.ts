import { Widget } from './widget';

export interface Section {
    layout: string;
    backgroundImageUrl: string;
    widgets: Array<Widget>;
}
