import { PromotionItem, PromotionType } from ".";

export interface Promotion {
    _id: any;
    type: PromotionType;
    name: string;
    description: string;
    items: Array<PromotionItem>;
    pricing: { saving: number, discountPercent?: number, value: number };
    from: number;
    to: number;
    code: string;
    loyaltyPoints?: number;
    active: boolean;
}