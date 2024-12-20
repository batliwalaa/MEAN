import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WINDOW } from '@common/src/lib/services/window.service';
import { ReviewSummary } from '@common/src/lib/types/review-summary';
import { BaseComponent } from '../../base.component';

@Component({
    selector: 'ui-rating-review-component',
    templateUrl: './rating-review.component.html',
    styleUrls: ['./rating-review.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RatingReviewComponent extends BaseComponent {
    @Input() reviewSummary: ReviewSummary;
    @Input() metadata: any;
    @Output() reviewClick: EventEmitter<void> = new EventEmitter<void>();

    get rating(): string {
        return `--rating: ${this.reviewSummary && this.reviewSummary.averageRating || 0}`;
    }

    constructor (
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    onStarClick(): void {
        this.reviewClick.emit();
    }
}