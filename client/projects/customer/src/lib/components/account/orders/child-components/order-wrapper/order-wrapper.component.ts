import { Component, Input, OnInit } from "@angular/core";

@Component({
    selector: 'ui-order-wrapper-component',
    templateUrl: './order-wrapper.component.html',
    styleUrls: ['./order-wrapper.component.scss']
})
export class OrderWrapperComponent implements OnInit {
    @Input() order: any;
    @Input() slot: any;
    @Input() metadata: any;
    @Input() template: 'LIST' | 'DETAIL' = 'LIST';

    showDetail: boolean = false;

    async ngOnInit(): Promise<void> {
        this.showDetail =  this.template === 'DETAIL' ? true : false;
    }
    
    public async onShowDetail(show: boolean): Promise<void> {
        this.showDetail =  this.template === 'DETAIL' ? true : show;
    }
}
