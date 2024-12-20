import { ProductRating } from "./product-rating";

export interface Review {
    _id: any;
    productID: string;
    rating: ProductRating;
    headline: string;
    review: string;
    createdDate: number;
    createdBy: string;
    modifiedDate: number;
    modifiedBy: string;
    processed: boolean;
    orderID: string;
    featuresRating?: Array<{ feature: string, rating: ProductRating }>,
    urls?: Array<{ type: 'image'|'video', src: string }>;
    user?: string
    votes?: { likeVote: number, dislikeVote: number };
}
