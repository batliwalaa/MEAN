export interface TextItemDefinition {
    column?: number;
    fontSize?: number;
    bold?: boolean;
    fillColor?: string;
    value?: string;
    x?: number;
    y?: number;
    key?: string;
    options?: { lineBreak?: boolean, align?: string };
    moveUp?: boolean;
    moveDown?: boolean;
    items: Array<TextItemDefinition>;
    format?: string;
    formatter?: string;
    width?: string;
}