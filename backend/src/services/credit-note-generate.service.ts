import { OrderService } from ".";
import { Injectable } from "../core/decorators";
import { Logging } from "../core/structured-logging/log-manager";
import { Logger } from "../core/structured-logging/logger";
import { ITask, TaskState } from "../core/tasks";
import { DocumentGenerationContext, DocumentTaskOrderable } from "./tasks";

@Injectable()
export class CreditNoteGenerateService {
    private tasks: Array<ITask<DocumentGenerationContext>>;
    private logger: Logger;

    constructor(
        creditNoteTaskOrderable: DocumentTaskOrderable,
        private orderService: OrderService
    ) {
        this.tasks = creditNoteTaskOrderable.orderedList();
        this.logger = Logging.getLogger('CreditNoteGenerateService');
    }
    public async generate(userID: string, orderID: string): Promise<void> {
        const length = this.tasks.length;
        let state: DocumentGenerationContext = { 
            _id: null,
            userID,
            orderID,
            taskState: TaskState.None,
            continue: true,
            font: 'Helvetica',
            fontBold: 'Helvetica-Bold',
            contextType: 'CreditNote'
        };
        this.logger.info('BEGIN: generating credit note', {...state, action: 'generate' });
        for (let index = 0; index < length; index++) {
            const task = this.tasks[index];
            
            if (task.isValid(state)) {
                state  = await task.process(state);
            }

            if (state.continue === false) {
                this.logger.warn('DISCONTINUING: generating credit note', { ...state, action: 'generate' });                
                await this.orderService.resetDocumentGenerationFlag(state.orderID, state.contextType);
                break;
            }
        }
        this.logger.info('END: generating credit note', { ...state, action: 'generate' });
    }
}
