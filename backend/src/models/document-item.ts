export interface DocumentItem { 
    type: string;
    subType: string;
    brand: string;
    description: string;
    quantity: number;
    price: number;
    amount: number;
    discountAmount?: number;
    returned: boolean;
    returnedQuantity: number;
    returnableAmount?: number;
}
