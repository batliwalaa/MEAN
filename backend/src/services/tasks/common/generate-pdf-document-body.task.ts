import path from 'path';

import { Injectable } from '../../../core/decorators';
import { DocumentItem } from '../../../models';
import { DocumentGenerationContext } from '..';
import { MetadataService } from '../../../singletons/metadata.service';
import { SectionDefinition } from '../models/section-definition';
import { BasePdfTask } from '../../../core/tasks/base-pdf.task';
import { isEmptyOrWhiteSpace } from '../../../core/utils';
import { TextItemDefinition } from '../models/text-item-definition';
import ICON_PATH from '../../../constants/icon-path.constant';
import { TaskState } from '../../../core/tasks';

@Injectable()
export class GeneratePdfDocumentBodyTask extends BasePdfTask<DocumentGenerationContext> {
    constructor (
        private metadataService: MetadataService
    ) {
        super();
    }
    
    public isValid(state: DocumentGenerationContext): boolean {
        return state.taskState !== TaskState.Completed && state.taskState !== TaskState.Failed;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        const sections: Array<SectionDefinition> = this.sections(state.contextType);
        const document = state.document;        
        document.y  = 60;

        for (const section of sections) {
            this.processSection(section, document, state);
        }
        
        return await Promise.resolve(state);
    }

    private sections(contextType: string): Array<SectionDefinition> {
        let sections: Array<SectionDefinition> = this.metadataService.find(this.documentKey(contextType));
        if (Array.isArray(sections)) {
            sections = sections.filter(s => s.key !== 'header' && s.key !== 'footer').sort((a, b) => a.ordinalPosition - b.ordinalPosition);
        }
        return sections;
    }

    private processSection(section: SectionDefinition, document: PDFKit.PDFDocument, state: DocumentGenerationContext): void {
        if (section.moveDown ?? true)  document.moveDown();

        if (section && section.value) {
            if (section.forLoop) {
                this.processForLoop(section, document, state);
            } else if (Array.isArray(section.value.textItems) && section.value.textItems) {
                this.processSectionForTextItems(section, document, state);
            } else if (Array.isArray(section.value.lineItems) && section.value.lineItems) {
                this.processSectionForLineItems(section, document, state);
            }
        }
    }

    private processSectionForLineItems(section: SectionDefinition, document: PDFKit.PDFDocument, state: DocumentGenerationContext): void {
        for (const li of section.value.lineItems) {
            this.ensurePage(document);

            if (li.lineWidth) document.lineWidth(li.lineWidth);
            if (li.strokeOpacity) document.fillOpacity(li.strokeOpacity);
            if (li.strokeColor) document.strokeColor(li.strokeColor);

            document.moveTo(li.x1, li.y1 ?? document.y)
                    .lineTo(li.x2 ?? (document.page.width - 50), li.y2 ?? document.y)
                    .stroke();
        }
    }

    private processSectionForTextItems(section: SectionDefinition, document: PDFKit.PDFDocument, state: DocumentGenerationContext): void {
        for (const ti of section.value.textItems) {
            this.ensurePage(document);
            if (Array.isArray(ti)) {
                this.processTextItemArray(ti, document, state);
            } else {
                if (ti.value && !ti.items) {
                    this.processTextItem(
                        document,
                        state,
                        ti.key,
                        ti.value,
                        ti.moveUp,
                        ti.moveDown,
                        ti.options,
                        ti.bold,
                        ti.fontSize,
                        ti.fillColor,
                        ti.x,
                        document.y,
                        {},
                        ti.format,
                        ti.formatter,
                        ti.width
                    );
                } else if (Array.isArray(ti.items)) {
                    this.processSubItems(ti, ti.items, document, state, ti.x, document.y);
                }
            }
        }
    }

    private processTextItemArray(ti: Array<TextItemDefinition>, document: PDFKit.PDFDocument, state: DocumentGenerationContext): void {
        const columns = ti.length;
        const x = ((document.page.width - 100) / columns) + 75;
        const w = ((document.page.width - 150) / columns);
        const y = document.y;
        let index = 1;
        for (const tai of ti) {
            this.ensurePage(document);
            if (tai.value && !tai.items) {
                this.processTextItem(
                    document,
                    state,
                    tai.key,
                    tai.value,
                    tai.moveUp,
                    tai.moveDown,
                    tai.options,
                    tai.bold,
                    tai.fontSize,
                    tai.fillColor,
                    (index === 1 ? tai.x : x),
                    y,
                    { width: w },
                    tai.format,
                    tai.formatter,
                    tai.width
                );
            } else if (Array.isArray(tai.items)) {
                this.processSubItems(tai, tai.items, document, state, (index === 1 ? tai.x : x), y, { width: w });
            }
            
            index++;
        }
    }

    private processSubItems(
        ti: TextItemDefinition,
        items: Array<TextItemDefinition>,
        document: PDFKit.PDFDocument,
        state: any,
        x: number,
        y: number,
        options: any = {}
    ): void {
        const width: Array<{index: number, width: number}> = [];
        let index = 0;
        let multiColumn = false;
        if (ti.column === 1) {
            document.x = 0;
        }
        if (ti.column === 2 && (ti?.options?.align === 'right' ?? false)) {            
            for(const i of items) {
                let value = i.key ? this.getValue(i.key, i.value, state) : i.value;
                if (i.format) {
                    value = this.getFormattedValue(i.format, i.formatter, value);
                }
                document.font(((i.bold ?? false) === false ? state.font : state.fontBold))
                        .fontSize(i.fontSize ?? ti.fontSize)
                width.push({index, width: document.widthOfString(value)});
                index++;
            }

            options = { align: 'left' };
            multiColumn = true;
        }
        index = 0;
        
        for (const i of items) {
            if (width.length > 0) {
                document.x = document.page.width - 51 - width.filter(w => w.index !== index - 1).map(w => w.width).reduce((acc, cur) => acc + cur);
            }

            this.processTextItem(
                document,
                state,
                i.key,
                i.value,
                i.moveUp ?? ti.moveUp,
                i.moveDown ?? ti.moveDown,
                multiColumn ? null : ti.options,
                i.bold ?? ti.bold,
                i.fontSize ?? ti.fontSize,
                i.fillColor ?? ti.fillColor,
                multiColumn ? null : (x ?? 0) + (i.x ? i.x : 0),
                multiColumn ? null : y,
                multiColumn ? {} : options,
                i.format ? i.format : ti.format,
                i.formatter ? i.formatter : ti.formatter,
                i.width
            );
            index++;
        }
    }

    private processTextItem(
        document: PDFKit.PDFDocument,
        state: any,
        tiKey: string,
        tiValue: string,
        tiMoveUp: boolean,
        tiMoveDown: boolean,
        tiOptions?: any,
        tiBold?: boolean,
        tiFontSize?: number,
        tiFillColor?: string,
        x?: number,
        y?: number,
        options?: any,
        format?: string,
        formatter?: string,
        tiWidth?: string
    ): void {
        let value = this.getValue(tiKey, tiValue, state);
        if (!state.valueFormatted && (format || formatter)) {
            value = this.getFormattedValue(format, formatter, value);

        }

        if (!isEmptyOrWhiteSpace(value)) {
            if (!!tiMoveUp) {
                document.moveUp();
            }

            if (!!tiMoveDown) {
                document.moveDown();
            }
            
            document.fontSize(tiFontSize)
                    .fillColor(tiFillColor);

            if (formatter?.toLowerCase() === 'currency') {
                const valueWidth = document.widthOfString(value);
                x += (Number(tiWidth) - valueWidth) - 15;
                if (state.contextType === 'CreditNote') {
                    x += -5;
                    document.font(state.fontBold).text('-', x, y, { width: 2 });
                    x += 4;
                }
                document.font(((tiBold ?? false) === false ? state.font : state.fontBold));
                document.image(path.join(ICON_PATH, 'inr_re_symbol.png'), x, y, { width: 4 });
                x += 5;
            }
                        
            document.text((value === 'NULL' ? '' : value), x, y, { ...options, ...tiOptions });
        }
    }

    private processForLoop(section: SectionDefinition, document: PDFKit.PDFDocument, state: DocumentGenerationContext): void {
        const items: Array<DocumentItem> = <Array<DocumentItem>>this.getData(section.forLoop, state);
        const textItems = section.value.textItems;        
        let maxY = 0;
        if (textItems) {
            for (let index = 0; index < items.length; index++) {
                const item = items[index];
                let y = document.y;
                for (const ti of textItems) {
                    if (Array.isArray(ti.items)) {
                        for (const i of ti.items) {
                            let value = i.key ? this.getValue(i.key, i.value, {...item, loopIndex: (index + 1) }) : i.value;
                            if (i.formatter) {
                                value = this.getFormattedValue(i.format, i.formatter, value);
                            }
                            let parts: Array<string> = i.width ? [] : [value]
                            if (i.width) {
                                const valueWidth = document.font(((i.bold ?? ti.bold ?? false) === false ? state.font : state.fontBold))
                                        .fontSize(i.fontSize ?? ti.fontSize)
                                        .fillColor(i.fillColor ?? ti.fillColor)
                                        .widthOfString(value);
                                 if (valueWidth > Number(i.width)) {
                                    parts = this.splitString(document, value, Number(i.width) - 3);
                                 } else {
                                     parts = [value];
                                 }
                            }
                            let partY = document.y;
                            for (const p of parts) {
                                this.processTextItem(
                                    document,
                                    { font: state.font, fontBold: state.fontBold, valueFormatted: true, contextType: state.contextType },
                                    null,
                                    p,
                                    i.moveUp ?? ti.moveUp,
                                    i.moveDown ?? ti.moveDown,
                                    ti.options,
                                    i.bold ?? ti.bold,
                                    i.fontSize ?? ti.fontSize,
                                    i.fillColor ?? ti.fillColor,
                                    (ti.x ?? 0) + (i.x ? i.x : 0),
                                    partY,
                                    {},
                                    i.format ? i.format : ti.format,
                                    i.formatter ? i.formatter : ti.formatter,
                                    i.width
                                );
                                if (partY === document.y) {
                                    document.moveDown();
                                }
                                partY = document.y;
                                if (document.y > maxY) {
                                    maxY = document.y;
                                }                                
                            }
                            document.y = y;
                        }
                    }

                    if (y === document.y) {
                        document.moveDown();
                    }
                    if (this.ensurePage(document)) maxY = document.y;                    
                    y = document.y;
                }
                document.y = maxY;
                document.moveDown();
            }
        }
        
    }
}
