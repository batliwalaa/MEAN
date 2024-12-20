import { Component, Inject, Input } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NotificationMessageKeys } from "@common/src/lib/constants/notification.message.keys";
import { 
    AuthService,
    BaseComponent,
    DataStoreService,
    MenuStateService,
    NavigationService,
    NotificationService,
    Product,
    ProductReviewService,
    Review,
    WINDOW
 } from "@common/src/public-api";
import { interval } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'ui-multi-item-review-component',
    templateUrl: './multi-item-review.component.html',
    styleUrls: ['./multi-item-review.component.scss']
})
export class MultiItemReviewComponent extends BaseComponent {
    products: Array<Product> = [];
    reviews: Array<Review> = [];
    
    @Input() metadata: any;
    
    constructor(
        router: Router,
        @Inject(WINDOW) window: Window,
        menuStateService: MenuStateService,
        dataStoreService: DataStoreService,
        private activatedRoute: ActivatedRoute,
        private productReviewService: ProductReviewService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private navigationService: NavigationService
    ) {
        super(router, window, menuStateService, dataStoreService);        
    }

    protected async init(): Promise<void> {
        const data = this.activatedRoute.snapshot.data;

        this.metadata = data.metadata['MultiItemReview'];
        this.products = data.products;
        this.reviews = data.reviews;

        interval(100).pipe(takeUntil(this.$destroy)).subscribe(async _ => {
            this.menuStateService.changeShowMainMenu(!this.isMobile);
            this.menuStateService.changeShowSubMenu(this.menuStateService.getShowMainMenu());
        });
    }

    public get user(): string {
        const user = this.authService.user;
        return `${user.firstName} ${user.lastName}`;
    }

    public getImageUrl(productID: string): string {
        const product = this.products.find(p => p._id === productID);

        if (product && Array.isArray(product.images)){
            const image = product.images.find(i => Number(i.size) === 0);

            if (image) {
                return image.src;
            }
        }
        return '';
    }

    public getProductDescription(productID: string): string {
        return this.products.find(p => p._id === productID)?.title || '';
    }

    public async onRatingChange($event: { selected: boolean, value: number }, review: Review): Promise<void> {
        const clone = { ...review }
        clone.rating = review.rating === 1 && $event.value === 1 && !$event.selected ? 0 : $event.value;

        await this.updateReview(clone);
        await Promise.resolve();
    }

    public async onImageClick(review: Review): Promise<void> {
        await this.navigationService.navigateForUrl(`/review/product/${review.productID}/order/${review.orderID}`, `/reviews/order/${review.orderID}`, this.isMobile);
    }

    private async updateReview(review: Review): Promise<void> {
        try {
            const index = this.reviews.findIndex(r => r._id === review._id);

            await this.tokenService.xsrf();

            const reviewToUpdate = await this.productReviewService.saveReview(review).toPromise();
            this.reviews.splice(index, 1, reviewToUpdate);
        } catch {
            this.notificationService.showMessage(NotificationMessageKeys.GenericError);
        }
    }
}