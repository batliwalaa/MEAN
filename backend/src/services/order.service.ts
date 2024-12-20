import { Injectable } from '../core/decorators';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import { MultiOrderHeaderRepository, OrderRepository } from '../repositories';
import { ShoppingCartService } from './shopping-cart.service';
import {
    DeliverySlotType,
    MultiOrderHeader,
    Order,
    OrderLocation,
    OrderRouteDetail,
    OrderSearchMap,
    OrderStatus,
    Result
} from '../models';
import { OrderPaymentStatus } from '../models/enums/order-payment-status';
import { Lock } from '../core/lock/lock';
import { Logger } from '../core/structured-logging/logger';
import { Logging } from '../core/structured-logging/log-manager';
import { FileType } from '../models/enums/file-type';


@Injectable()
export class OrderService extends BaseService {
    private logger: Logger;
    constructor(
        private orderRepository: OrderRepository,
        private multiOrderHeaderRepository: MultiOrderHeaderRepository,
        private shoppingCartService: ShoppingCartService,
        private lock: Lock,
        redisService: RedisService
    ) {
        super(redisService);
        this.logger = Logging.getLogger('order.service');
    }

    public async create(
        shoppingCartID: string,
        orderPaymentStatus: OrderPaymentStatus,
        routeDetail: OrderRouteDetail,
        addressID: string,
        userID: string,
        sessionID: string,
        currentUserID: string,
        promotions: Array<string>,
        pointsToRedeem: number,
        amount: string
    ): Promise<{id: string, amount: number, orderNumber: string, isMultiOrder: boolean}> {
        const orders: Array<Order> = await this.getOrderFromShoppingCart(shoppingCartID, userID, currentUserID, sessionID, addressID, routeDetail, orderPaymentStatus);
        const created = [];
        let multiOrderHeader: MultiOrderHeader;
        let isMultiOrder: boolean = false;

        await this.shoppingCartService.setPaymentInProgress(shoppingCartID, userID);
        
        // TODO: promotions, loyaltypoints, calculate amount
        if (orders.length > 1) {
            multiOrderHeader = await this.multiOrderHeaderRepository.save({
                multiOrderNumber: `M-${this.getOrderNumber()}`,
                orderPaymentStatus: orderPaymentStatus,
                totalAmount: Number(amount),
                userID,
                _id: null
            });

            for (const order of orders) {
                order.isMultiOrder = true;
                order.multiOrderHeaderID = multiOrderHeader._id;
            }

            isMultiOrder = true;
        }

        for (let i = 0; i < orders.length; i++) {
            const order = orders[i];     
            created.push(await this.orderRepository.save(order));
        }

        return { 
            id: (isMultiOrder ? multiOrderHeader._id : created[0]._id.toString()),
            amount: (isMultiOrder ? multiOrderHeader.totalAmount : created[0].amount),
            orderNumber: (isMultiOrder ? multiOrderHeader.multiOrderNumber : created[0].orderNumber),
            isMultiOrder
        };
    } 

    public async getDocumentFilename(orderID: string, fileType: FileType): Promise<string>{
        return await this.orderRepository.getDocumentFilename(orderID, fileType);   
    }

    public async getByOrderID(userID: string, orderID: string): Promise<Order> {
        return await this.orderRepository.getByOrderID(userID, orderID);       
    }
    
    public async search(userID: string, pageNumber: number, searchMap: OrderSearchMap): Promise<Result<Order>> {
        return await this.orderRepository.search(userID, pageNumber, searchMap);
    }

    public async getOrderProduct(orderID: string, productID: string): Promise<any> {
        return await this.orderRepository.getOrderProduct(orderID, productID);
    }

    public async getOrdersReadyForInvoicing(): Promise<Array<{userID: string, orderID: string}>> {
        let orders: Array<{ userID: string, orderID: string }>
        try {
            await this.lock.acquire('scheduled-order-invoice-generation');
            
            orders = await this.orderRepository.getOrdersReadyForInvoicing();
            await this.orderRepository.setSelectedForInvoice(orders.map(o => o.orderID));

            await this.lock.release('scheduled-order-invoice-generation');
        } catch (e) {
            this.logger.error(`ERROR: Retrieving order list ready for invoicing (called from scheduler)`, { action: 'getOrdersReadyForInvoicing'}, e);
            orders = [];
            await this.lock.release('scheduled-order-invoice-generation');
        }
        return orders;
    }

    public async getOrdersForCreditNote(): Promise<Array<{ orderID: string, userID: string }>> {
        let orders: Array<{ orderID: string, userID: string }>
        try {
            await this.lock.acquire('scheduled-order-credit-note-generation');
            
            orders = await this.orderRepository.getOrdersForCreditNote();
            await this.orderRepository.setSelectedForCreditNote(orders.map(o => o.orderID));

            await this.lock.release('scheduled-order-credit-note-generation');
        } catch (e) {
            this.logger.error(`ERROR: Retrieving order list ready for credit note (called from scheduler)`, { action: 'getOrdersForCreditNote'}, e);
            orders = [];
            await this.lock.release('scheduled-order-credit-note-generation');
        }
        return orders;
    }

    public async resetDocumentGenerationFlag(orderID: string, contextType: 'Invoice' | 'CreditNote'): Promise<void> {
        await this.orderRepository.resetDocumentGenerationFlag(orderID, contextType);
    }

    private async getOrderFromShoppingCart(
        shoppingCartID: string,
        userID: string,
        currentUserID: string,
        sessionID: string,
        addressID: string,
        routeDetail: OrderRouteDetail,
        orderPaymentStatus: OrderPaymentStatus = OrderPaymentStatus.PaymentInProgress
    ): Promise<Array<Order>> {
        const shoppingCart = await this.shoppingCartService.getByID(shoppingCartID);
        const now: Date = new Date(Date.now());
        const shoppingCartitems = shoppingCart.items;
        const sellerIds = [...new Set(shoppingCartitems.map(i => i.sellerID))];
        const orders: Array<Order> = [];

        for (let i = 0; i < sellerIds.length; i++) {
            const items = shoppingCartitems.filter(item => item.sellerID === sellerIds[i]);
            const amount = items
                            .map((item) => item.quantity * item.pricing.retail)
                            .reduce((acc, val) => acc + val);
            orders.push({
                _id: null,
                addressID: addressID,
                orderNumber: this.getOrderNumber(),
                dateCreated: now,
                items: [...items],
                modifiedBy: currentUserID,
                modifiedDate: now,
                orderLocation:
                    shoppingCart.slotType === DeliverySlotType.Panchshil
                        ? OrderLocation.Panchshil
                        : OrderLocation.NonPanchshil,
                orderPaymentStatus: orderPaymentStatus,
                routeDetail: routeDetail,
                slotId: shoppingCart.slotID,
                slotType: shoppingCart.slotType,
                status: OrderStatus.PaymentInProgress,
                statusHistory: [ { status: OrderStatus.PaymentInProgress, statusDate: now }],
                userID: userID,
                sessionID: sessionID,
                amount: amount,
                shoppingCartID: shoppingCartID,
                isMultiOrder: sellerIds.length > 1,
                sellerID: sellerIds[i]
            });
        }
        return orders;
    }

    public getRandom(): string {
        const result = Array<number>();
        for (var a = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], i = a.length; i--; ) {
            result.push(a.splice(Math.floor(Math.random() * (i + 1)), 1)[0]);
        }

        return result.join('');
    }

    public async saveInvoiceState(
        orderID: string,
        fileName: string,
        invoiceNumber: string,
        invoiceDate: Date
    ): Promise<void> {
        await this.orderRepository.saveInvoiceState(orderID, fileName, invoiceNumber, invoiceDate);
    }

    public async saveCreditNoteFile(
        orderID: string,
        fileName: string,
        creditNoteNumber: string,
        creditNoteDate: Date
    ): Promise<void> {
        await this.orderRepository.saveCreditNoteState(orderID, fileName, creditNoteNumber, creditNoteDate);
    }

    public async setOrderStatus( orderID: string, orderStatus: OrderStatus, userID: string):  Promise<any> {
        return await this.orderRepository.setStatus(orderID, orderStatus, userID);
    }

    private getOrderNumber(): string {
        const now: Date = new Date(Date.now());

        return `${now.getDate().toString().padStart(3, '0')}-100${now.getMonth().toString().padStart(2, '0')}${now.getFullYear().toString()}-${this.getRandom()}`
    }
}
