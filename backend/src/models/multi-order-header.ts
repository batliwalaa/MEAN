import { OrderPaymentStatus } from "./enums/order-payment-status";

export interface MultiOrderHeader {
    _id: any;
    userID: string;
    sessionID?: string;
    multiOrderNumber: string;
    totalAmount: number;
    orderPaymentStatus: OrderPaymentStatus;
    paymentID?: string;
}