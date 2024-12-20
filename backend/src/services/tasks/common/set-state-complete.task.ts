import { OrderService } from "../..";
import { Injectable } from "../../../core/decorators";
import { DocumentGenerationContext } from '..';
import { DocumentGenerationContextRepository } from '../../../repositories';
import { BaseTask, TaskState } from '../../../core/tasks';
import { DocumentGenerationContextModel } from "../../../repositories/models/document-generation-context.model";

@Injectable()
export class SetStateCompleteTask extends BaseTask<DocumentGenerationContext, DocumentGenerationContextModel> {
    constructor(
        DocumentGenerationContextRepository: DocumentGenerationContextRepository
    ) {
        super(DocumentGenerationContextRepository);
    }

    public isValid(state: DocumentGenerationContext): boolean { 
        return state.taskState !== TaskState.Completed;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        state.taskState = TaskState.Completed;
        await this.contextRepository.save(state)

        return state;
    }
}