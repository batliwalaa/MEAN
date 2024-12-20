import { Pricing } from './pricing';
import { ProductDetail } from './product-detail';
import { ReviewSummary } from './review-summary';
import { Shipping } from './shipping';

export interface Product {
    _id: any;
    lob: string;
    type: string;
    subType?: string;
    brand: string;
    title: string;
    pricing: Pricing;
    bestSeller: boolean;
    details: Array<ProductDetail>;
    country: string;
    images: Array<{ size: number, src: string}>;
    payOnDelivery: boolean;
    shipping: Shipping;
    test?: boolean;
    active?: boolean;
    reviewSummary?: ReviewSummary;
    returnableDate?: Date;
    hasProductSupport?: boolean;
    features?: Array<string>;
    sellerID: string;
}
