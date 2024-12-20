import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RouteKeys } from '@common/src/lib/constants/route.keys';
import { WINDOW } from '@common/src/lib/services/window.service';
import { ProductRating } from '@common/src/lib/types/product-rating';
import { ReviewSummary } from '@common/src/lib/types/review-summary';
import { BaseComponent } from '../../base.component';

@Component({
    selector: 'ui-review-summary-component',
    templateUrl: './review-summary.component.html',
    styleUrls: ['./review-summary.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReviewSummaryComponent extends BaseComponent {
    @Input() reviewSummary: ReviewSummary;
    @Input() metadata: any;
    @Input() showViewAll: boolean = true;
    @Input() showAverageRating: boolean = true;
    
    get rating(): string {
        return `--rating: ${this.reviewSummary && this.reviewSummary.averageRating || 0}`;
    }

    constructor (
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }


    ratingSummary(summary: { productRating: ProductRating, value: number }): string {
        switch(summary.productRating) {
            case ProductRating.OneStar:
                return 'one-star';
            case ProductRating.TwoStar:
                return 'two-star';
            case ProductRating.ThreeStar:
                return 'three-star';
            case ProductRating.FourStar:
                return 'four-star';
            case ProductRating.FiveStar:
                return 'five-star';
        }
    }

    percent(value: number): string {
        return `--percent: ${value.toString()}%`;
    }

    public async onViewReviews(): Promise<void> {
        this.router.navigateByUrl(`${RouteKeys.ProductDetail}${this.reviewSummary.productID}?vr=true`, { skipLocationChange: false, replaceUrl: true });
    }
}