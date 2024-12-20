import { Injectable } from "../../../core/decorators";
import { DocumentGenerationContextRepository } from '../../../repositories';
import { DocumentGenerationContext } from '..';
import { SequenceGenerateService } from "../../sequence-generator.service";
import { DocumentGenerationContextModel } from "../../../repositories/models/document-generation-context.model";
import { BaseTask } from "../../../core/tasks";

@Injectable()
export class GenerateDocumentNumberTask extends BaseTask<DocumentGenerationContext, DocumentGenerationContextModel> { 
    constructor(
        DocumentGenerationContextRepository: DocumentGenerationContextRepository,
        private sequenceGeneratorService: SequenceGenerateService
    ) {
        super(DocumentGenerationContextRepository);
    }
    
    public isValid(state: DocumentGenerationContext): boolean { 
        if (state.templateData && state.templateData.seller && state.templateData.orderNumber && !state.templateData.number) {
            return true;
        }

        return false;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        const id = await this.sequenceGeneratorService.nextId();
        const contextType = state.contextType === 'Invoice' ? 'INV' : 'CN';
        state.templateData.number = `${contextType}-${state.templateData.seller.stateUTCode.Key}-${id}`;
        
        await this.contextRepository.save(state)

        return state;
    }
}