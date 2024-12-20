import { IHandler } from '../../core/mediator/handler';
import { CreditNoteGenerateRequest } from '..';
import { CreditNoteGenerateService } from '../../services'
import { Injectable } from '../../core/decorators';

@Injectable()
export class CreditNoteGenerateHandler implements IHandler<CreditNoteGenerateRequest, void> {
    constructor (private creditNoteGenerateService: CreditNoteGenerateService) {
    }

    public async handle(request: CreditNoteGenerateRequest): Promise<void> {
        await this.creditNoteGenerateService.generate(request.userID, request.orderID);
    }
}