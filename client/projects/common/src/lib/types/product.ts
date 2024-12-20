import { Shipping } from '../types/shipping';
import { Pricing } from '../types/pricing';
import { ProductDetail } from '../types/product-detail';
import { ReviewSummary } from './review-summary';

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
    reviewSummary?: ReviewSummary;
    returnableDate?: Date;
    hasProductSupport?: boolean;
    features?: Array<string>;
    sellerID: string;
}
