import { OrderItem } from "./order-item";
import { OrderPaymentStatus } from "./order-payment-status";
import { OrderStatus } from "./order-status";

export interface Order {
    _id: string;
    addressID: string;
    userID: string;
    statusHistory: Array<{ status: OrderStatus, statusDate: Date}>;
    status: OrderStatus;
    invoice: string;
    dateCreated: Date;
    amount: number;
    orderNumber: string;
    items: Array<OrderItem>;
    orderPaymentStatus: OrderPaymentStatus;
    slotId: string;
    modifiedDate: string;
}