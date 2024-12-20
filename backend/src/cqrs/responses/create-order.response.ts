export interface CreateOrderResponse {
    id?: string,
    amount?: number,
    orderNumber?: string,
    isMultiOrder?: boolean,
    valid?: boolean,
    availablePoints?: number;
    pointsToredeem?: number;
    url?: string;
}