import { ProductRating } from "./product-rating";

export interface ReviewSummary {
    productID?: string;
    totalRatings?: number;
    averageRating?: number;
    ratingSummary?: Array<{ productRating: ProductRating, value: number }>;    
    featuresRating?: Array<{ feature: string, value: number }>;
}