import { ChangeDetectionStrategy, Component, Inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import { WINDOW } from "@common/src/lib/services/window.service";
import { ProductRating } from "@common/src/lib/types/product-rating";

import { BaseComponent } from "../../base.component";

@Component({
    selector: 'ui-feature-review-component',
    templateUrl: './feature-review.component.html',
    styleUrls: ['./feature-review.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeatureReviewComponent extends BaseComponent {
    @Input() featuresRating: Array<{ productRating: ProductRating, value: number; feature: string }>;
    @Input() metadata: any;
    
    constructor(
        router: Router,
        @Inject(WINDOW) window: Window
    ) {
        super(router, window);
    }

    public getRating(r: any): string {
        return `--rating: ${r && r.value || 0}`;
    }
}