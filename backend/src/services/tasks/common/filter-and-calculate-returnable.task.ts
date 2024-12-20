import { Injectable } from "../../../core/decorators";
import { TaskState } from '../../../core/tasks';
import { DocumentGenerationContextRepository } from "../../../repositories";
import { BaseTask } from "../../../core/tasks";
import { DocumentGenerationContext } from '..';
import { DocumentGenerationContextModel } from "../../../repositories/models/document-generation-context.model";
import { OrderStatus } from "../../../models";

@Injectable()
export class FilterAndCalculateReturnableTask extends BaseTask<DocumentGenerationContext, DocumentGenerationContextModel> {
    constructor(
        documentGenerationContextRepository: DocumentGenerationContextRepository
    ) {
        super(documentGenerationContextRepository);
    }
    public isValid(state: DocumentGenerationContext): boolean { 
        if (state.taskState !== TaskState.Running && state.contextType !== 'CreditNote') {
            return false;
        }
        
        return true;
    }

    public async execute(state: DocumentGenerationContext): Promise<DocumentGenerationContext> {
        if (state.templateData.status === OrderStatus.Returned) {
            state.templateData.returnableAmount = state.templateData.orderAmount;
            for (const di of state.templateData.items) {
                di.returnableAmount = di.amount;
                di.returnedQuantity = di.quantity;
            }
        } else if (state.templateData.status === OrderStatus.SemiReturned) {
            state.templateData.items = state.templateData.items.filter(i => i.returned === true);
            let totalAmount = 0;
            for (const i of state.templateData.items) {
                i.returnedQuantity = i.returnedQuantity ?? i.quantity;
                i.returnableAmount = i.returnedQuantity  * i.price;
                totalAmount += i.returnableAmount;
            }
            state.templateData.returnableAmount = totalAmount;
        }
        
        await this.contextRepository.save(state);

        return state;
    }
}