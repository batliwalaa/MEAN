import { Component, Input} from '@angular/core';
import { ProductDetail } from '@common/src/public-api';

@Component({
    selector: 'ui-detail-description-component',
    templateUrl: './detail-description.component.html',
    styleUrls: ['./detail-description.component.scss'],
})
export class DetailDescriptionComponent{
    @Input() productDetails: Array<ProductDetail>;

    public get displayType(): 'list'|'table'|'text' {
        return this.productDetails[0].displayType;
    }

    public get sectionName(): string {
        return this.productDetails[0].section;
    }   
}