import { Component, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

import { BaseComponent, ConfigService, IConfiguration, Product, RouteKeys, WINDOW} from '@common/src/public-api';
import { ProductDetail } from '@common/src/lib/types/product-detail';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'ui-detail',
    templateUrl: './detail.content.component.html',
    styleUrls: ['./detail.content.component.scss'],
})
export class DetailContentComponent extends BaseComponent {
    itemDetail: Product;
    metadata: any;
    packItems: Array<Product>;    
    showSidebar = false;
    selectedImage: number = 0;
    sections: Array<string>;
    readonly configuration: IConfiguration

    constructor(
        private activatedRoute: ActivatedRoute,
        private route: Router,
        private titleService: Title,
        private metaService: Meta,
        @Inject(WINDOW) window: Window,
        configService: ConfigService,
        router: Router
    ) {
        super(router, window);
        this.configuration = configService.getConfiguration();
    }

    protected async init(): Promise<void> {
        this.activatedRoute.data.pipe(takeUntil(this.$destroy)).subscribe(data => {
            this.itemDetail = this.activatedRoute.snapshot.data.detail;
            this.metadata = this.activatedRoute.snapshot.data.metadata['Content'];
            this.packItems = this.activatedRoute.snapshot.data.sizes;

            this.titleService.setTitle(`${this.itemDetail.lob} - ${this.itemDetail.type}, ${this.itemDetail.brand}`);
            this.metaService.addTag({
                name: 'description',
                content: this.getMetaTagDescription(),
            });
            this.getDistinctDetailSections();
        });
        
        await Promise.resolve();
    }

    public isSpeciality(title: string): boolean {
        return title.toLowerCase() === 'speciality';
    }

    public isDescription(title: string): boolean {
        return title.toLowerCase() === 'desc';
    }

    public isSelected(id: any): boolean {
        return this.itemDetail._id.toString() === id.toString();
    }
    
    get imageUrl(): string {
        if (this.itemDetail && Array.isArray(this.itemDetail.images)){
            const image = this.itemDetail.images.find(i => Number(i.size) === this.selectedImage);

            if (image) {
                return image.src;
            }
        }
        return '';
    }

    public get showReviews(): boolean {
        return this.configuration.showReview;
    }

    public getSize(productDetails: Array<ProductDetail>): string {
        const size = Array.isArray(productDetails) ? productDetails.find(pd => pd.title.toLowerCase() === 'size') : null;
        if (size) {
            return `${size.value}`;
        }

        return '';
    }

    public getSizePack(productDetails: Array<ProductDetail>): string {
        const sizePack = Array.isArray(productDetails) ? productDetails.find(pd => pd.title.toLowerCase() === 'pack') : null;
        if (sizePack) {
            return `${sizePack.value}`;
        }

        return '';
    }

    public toFixed(value: number): string {
        if (value) {
            return value.toFixed(2);
        }

        return '';
    }

    public onPackSelected(id: string): void {
        this.route.navigateByUrl(`${RouteKeys.ProductDetail}${id.toString()}`);
    }

    onTypeClick(): void {
        this.route.navigateByUrl(`${RouteKeys.ProductList}${btoa(JSON.stringify({ lob: this.itemDetail.lob, types: [this.itemDetail.type]}))}`);
    }

    onSubTypeClick(): void {
        this.route.navigateByUrl(`${RouteKeys.ProductList}${btoa(JSON.stringify({ lob: this.itemDetail.lob, types: [this.itemDetail.type], subTypes: [this.itemDetail.subType]}))}`);
    }

    getDistinctDetailSections(): void {
        this.sections = this.itemDetail.details.map(item => item.section).filter((value, index, self) => self.indexOf(value) === index);      
    }

    getProductDetails(section: string): Array<ProductDetail> {       
       return this.itemDetail.details.filter(d => d.section.toLowerCase() === section.toLocaleLowerCase());       
    }

    private getMetaTagDescription(): string {
        let description: string = `${this.itemDetail.lob},${this.itemDetail.type},${this.itemDetail.brand},${this.itemDetail.title}`;
        const details = this.itemDetail.details;

        for (let i = 0; i < details.length; i++) {
            const value = details[i].value;
            if (Array.isArray(value)) {
                for (let j = 0; j < value.length; j++) {
                    description += `,${value[j]}`;
                }
            } else {
                description += `,${value}`;
            }
        }

        return description;
    }
}
