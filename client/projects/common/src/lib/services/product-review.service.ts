import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ConfigService } from './config.service';
import { HttpService } from './http.service';
import { Review } from '../types/review';

@Injectable({
    providedIn: 'root',
})
export class ProductReviewService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public getReviews(productID: string, pageNumber: number = 1, reviewLimit: number = 10): Observable<any> {
        return this.executeGet(`product_reviews_${productID}`, `${this.baseUrl}/productreview/${productID}/${pageNumber}/${reviewLimit}`);
    }

    public updateReviewVote(reviewId: string, vote: { likeVote: boolean, dislikeVote: boolean }): Observable<any> {
        return this.httpClient.patch(`${this.baseUrl}/productreview/${reviewId}`, { vote });
    }

    public getOrderProductReview(orderID: string, productID: string): Observable<any> {
        return this.executeGet(`order_product_review_${orderID}_${productID}`, `${this.baseUrl}/productreview/order/${orderID}/product/${productID}`);
    }

    public getOrderReview(orderID: string): Observable<any> {
        return this.executeGet(`order_review_${orderID}`, `${this.baseUrl}/productreview/order/${orderID}`);
    }

    public saveReview(review: Review): Observable<Review> {
        return this.executePost(`order-product-review-${review.orderID}-${review.productID}`, `${this.baseUrl}/productreview`, { review });
    }
}
