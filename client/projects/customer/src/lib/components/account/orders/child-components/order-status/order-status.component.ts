import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { OrderStatus } from '../../../../../../../../common/src/lib/types/order-status';

@Component({
  selector: 'ui-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit, OnChanges{
    private readonly dictionary: { [status: string]: { showDate: boolean, showDeliveryDate: boolean, status: string }} = {}
    @Input() status: any;
    @Input() modifiedDate: any;
    @Input() slot: any;
    @Input() metadata: any;

    model: { showDate: boolean, showDeliveryDate: boolean, status: string };
    showFailedText: boolean = false;
  
    constructor() {      
    }

    async ngOnChanges(changes: SimpleChanges): Promise<void> {
        if (changes && changes['status']?.firstChange === false) {
            await this.setStatus();
        }
    }

    async ngOnInit(): Promise<void> {
        this.dictionary[ OrderStatus.Open] = { showDate: false, showDeliveryDate: true, status: this.metadata.picking.label };
        this.dictionary[ OrderStatus.Picking] = { showDate: false, showDeliveryDate: true, status: this.metadata.picking.label };
        this.dictionary[ OrderStatus.Dispatch] = { showDate: false, showDeliveryDate: true, status: this.metadata.picking.label };
        this.dictionary[ OrderStatus.PaymentInProgress] = { showDate: false, showDeliveryDate: false, status: this.metadata.paymentInProgress.label };
        this.dictionary[ OrderStatus.Failed] = { showDate: true, showDeliveryDate: false, status: this.metadata.failed.label };
        this.dictionary[ OrderStatus.Delivered] = { showDate: true, showDeliveryDate: false, status: this.metadata.delivered.label };
        this.dictionary[ OrderStatus.Returned] = { showDate: true, showDeliveryDate: false, status: this.metadata.returned.label };
        this.dictionary[ OrderStatus.SemiReturned] = { showDate: true, showDeliveryDate: false, status: this.metadata.semiReturned.label };
        this.dictionary[ OrderStatus.Closed] = { showDate: true, showDeliveryDate: false, status: this.metadata.closed.label };
        this.dictionary[ OrderStatus.Cancelled] = { showDate: true, showDeliveryDate: false, status: this.metadata.cancelled.label };
        
        await this.setStatus();
    }

    private async setStatus(): Promise<void> {
        this.model = this.dictionary[this.status];
        if(this.status === OrderStatus.Failed) {
            this.showFailedText = true;
        }
        else {
            this.showFailedText = false;
        }
           
        await Promise.resolve();
    }
}
