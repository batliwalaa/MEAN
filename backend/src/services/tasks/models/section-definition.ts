import { LineItemDefinition } from "./line-item-definition";
import { TextItemDefinition } from "./text-item-definition";

export interface SectionDefinition {
    ordinalPosition: number;
    key: string;
    moveDown: boolean;
    forLoop: string;
    value: {
        rect?: { x: number, y: number, w: number | string, h: number, fillColor: string },
        textItems?: Array<TextItemDefinition>;
        lineItems?: Array<LineItemDefinition>
    }    
}