import { OrderService } from "../..";
import { Injectable } from "../../../core/decorators";
import { DocumentGenerationContext } from '..';
import { DocumentGenerationContextRepository } from '../../../repositories';
import { BaseTask, TaskState } from '../../../core/tasks';
import { DocumentGenerationContextModel } from "../../../repositories/models/document-generation-context.model";

@Injectable()
export class UpdateOrderSetDocumentStateTask extends BaseTask<DocumentGenerationContext, DocumentGenerationContextModel> {
    constructor(
        DocumentGenerationContextRepository: DocumentGenerationContextRepository,
        private orderService: OrderService
    ) {
        super(DocumentGenerationContextRepository);
    }

    public isValid(state: DocumentGenerationContext): boolean { 
        return !!state.fileName && state.taskState !== TaskState.Completed;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        if (state.contextType === 'Invoice') {
            await this.orderService.saveInvoiceState(
                state.orderID,
                state.fileName,
                state.templateData.number,
                state.templateData.date
            );
        } else {
            await this.orderService.saveCreditNoteFile(
                state.orderID,
                state.fileName,
                state.templateData.number,
                state.templateData.date
            );
        }
        
        await this.contextRepository.save(state)

        return state;
    }
}