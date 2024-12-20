import { IHandler } from '../../core/mediator/handler';
import { InvoiceGenerateRequest } from '..';
import { InvoiceGenerateService } from '../../services';
import { Injectable } from '../../core/decorators';

@Injectable()
export class InvoiceGenerateHandler implements IHandler<InvoiceGenerateRequest, void> {
    constructor(
        private invoiceGenerateService: InvoiceGenerateService
    ) {

    }
    public async handle(request: InvoiceGenerateRequest): Promise<void> {        
        await this.invoiceGenerateService.generate(request.userID, request.orderID);
    }
}
