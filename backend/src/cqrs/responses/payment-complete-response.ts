import { OrderPaymentStatus } from "../../models/enums/order-payment-status";

export interface PaymentCompleteResponse {
    status: OrderPaymentStatus;
    message?: string;
    paymentTransactionID?: string;
    orderID?: string;
    bankReferenceNumber?: string;
    orderNumber?: string;
}