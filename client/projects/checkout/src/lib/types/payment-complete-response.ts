export interface PaymentCompleteResponse {
    status: string;
    message: string;
    paymentTransactionID?: string;
    orderID?: string;
    bankReferenceNumber?: string;
    orderNumber?: string;
}
