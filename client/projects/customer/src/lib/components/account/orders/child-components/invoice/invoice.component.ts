import { Component, Input } from "@angular/core";
import { FileType } from "@common/src/lib/types/file-type";
import { FileService, OrderService } from "@common/src/public-api";

@Component({
    selector: 'ui-order-invoice-component',
    templateUrl: './invoice.component.html',
    styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent {
    @Input() show: boolean;
    @Input() metadata: any;
    @Input() orderID: string;
    @Input() showCreditNote: boolean;

    constructor(
        private fileService: FileService
    ){}

    public async onInvoiceClick(): Promise<void> {
        this.show = !this.show;
    }

    public async onInvoiceViewClick($event: any): Promise<void> {
        await this.fileService.viewFile(this.orderID, FileType.Invoice).toPromise();
        $event.stopPropagation();
    }

    public async onCreditNoteClick($event: any): Promise<void> {    
        await this.fileService.viewFile(this.orderID, FileType.CreditNote).toPromise();
        $event.stopPropagation();
    }
}