import { ProductRating } from "./enums/product-rating";

export interface ReviewSummary {
    productID: string;
    totalRatings: number;
    avarageRating: number;
    ratingSummary: Array<{ productRating: ProductRating, value: number }>;
    featuresRating?: Array<{ feature: string, value: number }>;
}