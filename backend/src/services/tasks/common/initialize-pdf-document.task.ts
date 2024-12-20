import PDFDcoument from 'pdfkit';

import { Injectable } from '../../../core/decorators';
import { TaskState } from '../../../core/tasks';
import { MetadataService } from '../../../singletons/metadata.service';
import { MetadataKeyConstants } from '../../../constants/metadata-key.constants';
import { SectionDefinition } from '../models/section-definition';
import { BasePdfTask } from '../../../core/tasks/base-pdf.task';
import { DocumentGenerationContext } from '../contexts/document-generation.context';

@Injectable()
export class InitializePdfDocumentTask extends BasePdfTask<DocumentGenerationContext> {
    constructor (
        private metadataService: MetadataService
    ) {
        super()
    }

    public isValid(state: DocumentGenerationContext): boolean {
        return state.taskState !== TaskState.Completed && state.taskState !== TaskState.Failed;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        state.document = new PDFDcoument({ layout: 'portrait', margin: 50, bufferPages: true, autoFirstPage: false });
        state.document.on('pageAdded', () => {
            this.addDocumentHeader(state);
        });
        state.document.addPage();
        return await Promise.resolve(state);
    }

    private addDocumentHeader(state: DocumentGenerationContext): void {
        const section: SectionDefinition = this.metadataService.findSection(
            this.documentKey(state.contextType), 'header');

        const document = state.document;

        if (document) {
            if (section && section.value && section.value.rect) {
                const r = section.value.rect;
                const width = typeof r.w === 'string' ? this.getWidth(r.w, document.page) : r.w;
                document.rect(r.x, r.y, width, r.h).fill(r.fillColor);
            }

            if (section && section.value && Array.isArray(section.value.textItems)) {
                for (const ti of section.value.textItems) {
                    document.font(((ti?.bold ?? false) === false ? state.font : state.fontBold)).fontSize(ti.fontSize).fillColor(ti.fillColor)
                        .text(ti.value, ti.x, ti.y, ti.options);
                }
            }
        }
    }
}