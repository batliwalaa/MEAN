import { Injectable } from '../../../core/decorators';
import { TaskState } from '../../../core/tasks';
import { DocumentGenerationContext } from '..';
import { MetadataService } from '../../../singletons/metadata.service';
import { MetadataKeyConstants } from '../../../constants/metadata-key.constants';
import { SectionDefinition } from '../models/section-definition';
import { BasePdfTask } from '../../../core/tasks/base-pdf.task';

@Injectable()
export class GeneratePdfDocumentFooterTask extends BasePdfTask<DocumentGenerationContext> {
    constructor (
        private metadataService: MetadataService
    ) {
        super()
    }

    public isValid(state: DocumentGenerationContext): boolean {
        return state.taskState !== TaskState.Completed && state.taskState !== TaskState.Failed;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        const section: SectionDefinition = this.metadataService.findSection(
            this.documentKey(state.contextType), 'footer');
        const document = state.document;
        const range: {start: number, count: number} = document.bufferedPageRange();

        for (let i = range.start; i < range.count; i++) {
            document.switchToPage(i);

            if (section && section.value && section.value.rect) {
                const r = section.value.rect;
                const width = typeof r.w === 'string' ? this.getWidth(r.w, document.page) : r.w;
                document.rect(r.x, document.page.maxY() + r.y, width, r.h).fill(r.fillColor);
            }
    
            if (section && section.value && Array.isArray(section.value.textItems)) {
                for (const ti of section.value.textItems) {
                    document.font(((ti?.bold ?? false) === false ? state.font : state.fontBold)).fontSize(ti.fontSize);
                    let value = ti.value === '[PAGE_NUMBER]' ? `Page ${i+1} of ${range.count}` : ti.value;

                    const width = document.widthOfString(value, ti.options);
                    document.fillColor(ti.fillColor)
                        .text(value, 0.5 * (document.page.width - width), document.page.height - ti.y, ti.options);
                }
            }
        }
        
        return await Promise.resolve(state);
    }
}
