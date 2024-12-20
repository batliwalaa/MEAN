import { Component, ElementRef, Inject, Input, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { 
    BaseComponent,
    ConfigService,
    DataStoreService,
    InfiniteScrollService,
    LightboxService,
    MenuStateService,
    Product,
    ProductDetail,
    ProductReviewService,
    Review,
    ReviewSummary,
    WINDOW
} from "@common/src/public-api";
import { Result } from "@search/src/lib/types";
import { from, interval } from "rxjs";
import { debounce, delay, filter, first, takeUntil } from "rxjs/operators";
import { DetailService } from "../../../services/detail.service";

@Component({
    selector: 'ui-view-review-component',
    templateUrl: './view-review.component.html',
    styleUrls: ['./view-review.component.scss']
})
export class ViewReviewComponent extends BaseComponent {
    private _hasMorePages: boolean = true;
    private _pageNumber: number;
    private _loading: boolean = false;

    metadata: any;
    reviews: Array<Review>;
    product: Product;    
    reviewsCount: number;
    reviewLimit: number;

    @Input() showProductInfo: boolean = false;
    @Input() show: boolean = true;
    @ViewChild('navReviews') navReviewsRef: ElementRef;
    
    constructor(
        router: Router,
        @Inject(WINDOW) window: Window,
        menuStateService: MenuStateService,
        dataStoreService: DataStoreService,
        configService: ConfigService,
        private activatedRoute: ActivatedRoute,
        private detailService: DetailService,
        private infiniteScrollService: InfiniteScrollService,
        private lightboxService: LightboxService,
        private productReviewService: ProductReviewService
    ) {
        super(router, window, menuStateService, dataStoreService);
        this.reviewLimit = configService.getConfiguration().reviewLimit;
    }

    protected async init(): Promise<void> {
        const data = this.activatedRoute.snapshot.data;
        this.activatedRoute.queryParams.pipe(delay(0), first()).subscribe(param  => {
            if (param['vr'] === 'true') {
                this.scrollToReviews();
            }
        });

        this.product = data && data.detail;
        this.reviews = data && data.reviews.items;
        this.reviewsCount = data && data.reviews.count;
        this.metadata = data && data.metadata['ViewReview'];
        this._pageNumber = 1;

        if (this.showProductInfo) {
            this.infiniteScrollService.onScrolledDown
                .pipe(
                    filter(() => this._hasMorePages),
                    debounce(() => interval(200)),
                    takeUntil(this.$destroy))
                .subscribe(() => {
                    if (!this._loading) {
                        this._loading = true;
                        this.productReviewService.getReviews(this.product._id, ++this._pageNumber, this.reviewLimit)
                            .pipe(takeUntil(this.$destroy))
                            .subscribe((data: Result<Review>) => {
                                this._hasMorePages = Array.isArray(data.items) && data.items.length > 0;
                                this.reviews = this.reviews.concat(data.items);
                                this.reviewsCount = data.count;
                                this._loading = false;
                            });
                    }
            });
        }
    }

    get reviewSummary(): ReviewSummary {
        return this.product && this.product.reviewSummary;
    }

    get imageUrl(): string {
        if (this.product && Array.isArray(this.product.images)){
            const image = this.product.images.find(i => Number(i.size) === 0);

            if (image) {
                return image.src;
            }
        }
        return '';
    }

    get sortedFeaturesRating(): Array<any> {
        return this.reviewSummary && this.reviewSummary.featuresRating && this.reviewSummary.featuresRating.sort((a, b) =>  a.value - b.value).reverse();
    }

    get sortedReviews(): Array<any> {
        return this.reviews && this.reviews.sort((a, b) =>  a.modifiedDate - b.modifiedDate).reverse();
    }

    public getReviewDate(review: Review): Date {
        return new Date(new Date(review.modifiedDate).toDateString());
    }

    public isValidDate(review: Review): boolean {
        let dt = new Date(new Date(review.modifiedDate).toDateString());

        return dt instanceof Date && !isNaN(dt.getTime());
    }

    public getSizePack(details: Array<ProductDetail>): string {
        const sizePack = details.find(d => d.title.toLowerCase() === 'sizepack');
        return sizePack?.value ?? '';
    }

    public isSpeciality(title: string): boolean {
        return title.toLowerCase() === 'speciality';
    }

    public getBrand(): string {
        if (this.product.title.toLowerCase().includes(this.product.brand.toLowerCase())){
            return '';
        } else {
            return `${this.product.brand} `;
        }
    }

    public async onItemClick(): Promise<void> {
    }

    public async openLightbox(id: string): Promise<void> {
        this.lightboxService.open(id);

        await Promise.resolve();
    }

    public async onlightboxClose(id: string): Promise<void> {
        this.lightboxService.close(id);

        await Promise.resolve();
    }

    public async onSeeMoreReviewsClick(): Promise<void> {
        
    }

    public getRating(r: any): string {
        return `--rating: ${r && r.rating || 0}`;
    }

    public getLightboxData(src: string, idx: string): any {
        return { src, id: `review-image-${idx}` };
    }

    public async onVoteChange(review: Review, vote: { likeVote: boolean, dislikeVote: boolean }): Promise<void> {
        try {
            await this.productReviewService.updateReviewVote(review._id, vote).toPromise();
            
            if (!review.votes) {
                review.votes = { likeVote: 0, dislikeVote: 0 };
            }

            if (vote.likeVote) {
                review.votes.likeVote++;
            }
    
            if (vote.dislikeVote) {
                review.votes.dislikeVote++;
            }

        } catch (e) {
            // TODO: Error handling
        }
    }

    private scrollToReviews(): void {        
        this.navReviewsRef.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
}
