import { Injectable } from "../../../core/decorators";
import { TaskState } from '../../../core/tasks';
import { DocumentGenerationContextRepository } from "../../../repositories";
import { BaseTask } from "../../../core/tasks";
import { DocumentGenerationContext } from '..';
import { DocumentGenerationContextModel } from "../../../repositories/models/document-generation-context.model";

@Injectable()
export class SetDocumentGenerationDataStateTask extends BaseTask<DocumentGenerationContext, DocumentGenerationContextModel> {
    constructor(
        DocumentGenerationContextRepository: DocumentGenerationContextRepository
    ) {
        super(DocumentGenerationContextRepository);
    }
    public isValid(state: DocumentGenerationContext): boolean { 
        if (state && state.taskState !== TaskState.None) {
            return false;
        }
        
        return true;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        await this.contextRepository.setTaskState(state._id.toString(), TaskState.Running);

        state.taskState = TaskState.Running;

        return state;
    }
}
