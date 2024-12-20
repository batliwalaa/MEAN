import { DocumentItem, KeyValuePair, OrderPaymentStatus } from ".";
import { OrderStatus } from "./enums/order-status";


export interface Document {
    number?: string;
    date?: Date;
    seller?: { 
        name: string,
        address: string,
        pan: KeyValuePair<string>,
        gst: KeyValuePair<string>,
        stateUTCode: KeyValuePair<string>
    };
    shipping?: string;
    billing?: string;
    supplyState?: string;
    deliveryState?: string;
    items?: Array<DocumentItem>;
    orderNumber?: string;
    orderAmount?: number;
    totalDiscountAmount?: number;
    orderPaymentStatus?: OrderPaymentStatus;
    orderDate?: Date;
    status: OrderStatus;
    invoiceNumber?: string;
    invoiceDate?: Date;
    returnableAmount?: number;
}
