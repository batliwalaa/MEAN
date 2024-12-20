import { Injectable } from "../../../core/decorators";
import { DocumentGenerationContext } from '..';
import { DocumentGenerationContextRepository } from '../../../repositories';
import { BaseTask } from '../../../core/tasks';
import { TaskState } from '../../../core/tasks';
import { DocumentGenerationContextModel } from "../../../repositories/models/document-generation-context.model";

@Injectable()
export class GetDocumentGenerationContextTask extends BaseTask<DocumentGenerationContext, DocumentGenerationContextModel> {   
    constructor(
        DocumentGenerationContextRepository: DocumentGenerationContextRepository
    ) {
        super(DocumentGenerationContextRepository);
    }

    public isValid(state: DocumentGenerationContext): boolean { 
        return true; 
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        let r = await this.contextRepository.getForOrderIDAndContextType(state.orderID, state.contextType);

        if (!r) {
            const id = await this.contextRepository.save(state);
            if (id) {
                state._id = id.toString();
            }  
            
            return state;
        } else {
            r._id = r._id.toString();
            if (r.taskState == TaskState.Completed) {
                this.logger.warn(`WARNING: Discontinuing PDF generate ${state.contextType} task - contextID: ${r._id.toString()}, contextType: ${state.contextType}`, { ...state, action: 'process' });
                r.continue = false;
            }
            return r;
        }
    }
}