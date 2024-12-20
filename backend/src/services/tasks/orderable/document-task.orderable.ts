import { CollectionConstants } from "../../../constants/collection.constants";
import { Injectable } from "../../../core/decorators";
import { Injector } from "../../../core/di/injector";
import { ITask, ITaskOrderable } from "../../../core/tasks";
import { Type } from "../../../typings/decorator";
import { 
    DocumentGenerationContext,
    FilterAndCalculateReturnableTask,
    GenerateDocumentNumberTask,
    GeneratePdfDocumentBodyTask,
    GeneratePdfDocumentFooterTask,
    GetCustomerInformationTask,
    GetDocumentGenerationContextTask,
    GetOrderInformationTask,
    GetSellerInformationTask,
    InitializePdfDocumentTask,
    SetDocumentGenerationDataStateTask,
    SetStateCompleteTask,
    UpdateOrderSetDocumentStateTask,
    WritePdfDocumentTask
} from "..";

@Injectable()
export class DocumentTaskOrderable implements ITaskOrderable<DocumentGenerationContext> {
    private readonly orderedTasks: Array<Type<ITask<DocumentGenerationContext>>> = 
    [
        GetDocumentGenerationContextTask,
        SetDocumentGenerationDataStateTask,
        GetOrderInformationTask,
        FilterAndCalculateReturnableTask,
        GetCustomerInformationTask,
        GetSellerInformationTask,
        GenerateDocumentNumberTask,
        InitializePdfDocumentTask,
        GeneratePdfDocumentBodyTask,
        GeneratePdfDocumentFooterTask,
        WritePdfDocumentTask,
        UpdateOrderSetDocumentStateTask,
        SetStateCompleteTask
    ]

    public orderedList(): Array<ITask<DocumentGenerationContext>> {
        const taskArray: Array<ITask<DocumentGenerationContext>> = Array(this.orderedTasks.length);
        const tasks = <Array<ITask<DocumentGenerationContext>>>Injector.resolveCollection(CollectionConstants.DOCUMENT_TASK_COLLECTION);

        for (const t of tasks) {
            const index = this.orderedTasks.findIndex(ot => t instanceof ot);
            taskArray[index] = t;
        }

        return taskArray;
    }
}
