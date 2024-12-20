import { Component, Input, ViewChild, ElementRef, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, ConfigService, NavigationService, ProductDetail, Product, WINDOW, IConfiguration } from '@common/src/public-api';

export interface Quantity {
    value: number;
    viewValue: string;
}

@Component({
    selector: 'ui-item-container-component',
    templateUrl: './item-container.component.html',
    styleUrls: ['./item-container.component.scss'],
})
export class ItemContainerComponent extends BaseComponent {
    @Input() metadata: any;
    @Input() item: Product;
    @Input() query: any;

    @ViewChild('itemContainer') itemContainer: ElementRef;
    itemQty = 1;
    showItemQtyTextControl = false;
    showReviewSummary = false;

    private readonly configuration: IConfiguration;
    constructor(
        @Inject(WINDOW) window: any,
        router: Router,
        private navigationService: NavigationService,
        configService: ConfigService
    ) {
        super(router, window);

        this.configuration = configService.getConfiguration();
    }

    public async onItemClick(): Promise<void> {
        let query = atob(this.query);
        query = query.includes('lob') ? query : JSON.stringify({ lob: this.item.lob.toLowerCase() })
        await this.navigationService.navigateForListItem(query, this.currentPage, this.item._id);
    }

    get imageUrl(): string {
        if (this.item && Array.isArray(this.item.images)){
            const image = this.item.images.find(i => Number(i.size) === 0);

            if (image) {
                return image.src;
            }
        }
        return '';
    }

    public getSizePack(details: Array<ProductDetail>): string {
        const sizePack = details.find(d => d.title.toLowerCase() === 'sizepack');
        console.log(sizePack.value);
        return sizePack?.value ?? '';
    }

    public hasSizePack(details: Array<ProductDetail>): boolean {
        return details.find(d => d.title.toLowerCase() === 'sizepack') !== undefined;
    }


    public isSpeciality(title: string): boolean {
        return title.toLowerCase() === 'speciality';
    }

    public getBrand(): string {
        if (this.item.title.toLowerCase().includes(this.item.brand.toLowerCase())){
            return '';
        } else {
            return `${this.item.brand} `;
        }
    }

    public get showReviews(): boolean {
        return this.configuration.showReview;
    }

    public get showCountryOfOrigin(): boolean {
        return this.configuration.showCountryOfOrigin;
    }
}
