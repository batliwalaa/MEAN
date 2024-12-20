import { Injectable } from '../core/decorators';
import { BaseService } from './base.service';
import { RedisService } from '../cache';
import { CryptoService, UserService } from './';
import { PaymentRequest, PaymentResponse, OrderStatus, EmailType, Result, Order } from '../models';
import { OrderPaymentStatus } from '../models/enums/order-payment-status';
import { MultiOrderHeaderRepository, OrderRepository, PaymentResponseRepository, ShoppingCartRepository } from '../repositories';
import { PubSubChannelKeys } from '../keys/redis-pub-sub-channel.keys';
import request from 'request';
import { LoyaltyPointService } from './loyalty-point.service';
import { PaymentCompleteResponse } from '../cqrs';

@Injectable()
export class PaymentService extends BaseService {
    constructor(
        private userService: UserService,
        private cryptoService: CryptoService,
        private paymentResponseRepository: PaymentResponseRepository,
        private orderRepository: OrderRepository,
        private multiOrderHeaderRepository: MultiOrderHeaderRepository,
        private shoppingCartRepository: ShoppingCartRepository,
        private loyaltyPointService: LoyaltyPointService,
        redisService: RedisService
    ) {
        super(redisService);
    }

    public async initiate(userID: string, orderID: string, amount: number): Promise<PaymentRequest | { url: string }> {
        const user = await this.userService.getUserById(userID);
        const mode = process.env.PAYMENT_GATEWAY_MODE;

        const pd: PaymentRequest = {
            amount: amount.toFixed(2),
            email: user.emailId,
            firstname: user.firstName,
            phone: user.mobile,
            txnid: orderID,
            productinfo: 'Amreet Bazaar',
            furl: process.env.PAYMENT_GATEWAY_FURL,
            surl: process.env.PAYMENT_GATEWAY_SURL,
            udf5: (mode === 'redirect' ? 'REDIRECT' : 'BOLT_KIT_NODE_JS'),
            key: process.env.PAYMENT_GATEWAY_MERCHANT_KEY
        };

        pd.hash = this.cryptoService.generateHashForPayment(pd);

        if (mode !== 'redirect') {
            return pd;
        } else {
           const url = await this.pay(pd);
           return { url }
        }
    }

    public async complete(orderID: string, userID: string, shoppingCartID: string, paymentResponse: PaymentResponse, orderNumber: string): Promise<PaymentCompleteResponse> {
        const orderIDs = await this.getOrderIDs(userID, orderID, orderNumber);
        const isMultiOrder: boolean = orderNumber.startsWith('M-');

        if (paymentResponse.txnStatus.toLowerCase() === 'cancel') {
            await this.cancel(orderIDs, userID, shoppingCartID, (isMultiOrder ? orderID : null));
            return { status: OrderPaymentStatus.PaymentCancelled, message: paymentResponse.txnStatus };
        }
        
        const isValid = process.env.PAYMENT_GATEWAY_TEST_DATA === 'true' ? true : this.isValidPaymentResponse(paymentResponse);
        const paymentResponseID = await this.paymentResponseRepository.save(paymentResponse);

        await this.setOrderPaymentStatus(orderIDs, userID, isValid, paymentResponseID, shoppingCartID, isMultiOrder ? orderID : null);
        
        if (isValid) {
            await this.success(orderNumber, orderID, userID, shoppingCartID, Math.floor(Number(paymentResponse.amount)/100));
        } else {
            await this.loyaltyPointService.clearReserved(userID, orderID);
        }
        
        return { 
            status: isValid ? OrderPaymentStatus.PaymentSuccess : OrderPaymentStatus.PaymentFailure,
            bankReferenceNumber: paymentResponse.bank_ref_num,
            orderID,
            paymentTransactionID: paymentResponseID,
            orderNumber
        };
    }

    public async get(id: string): Promise<PaymentResponse> {
        const cacheKey = `/payment-response/get/:${id}`;

        return await this.execute(cacheKey, 84600, () => this.paymentResponseRepository.get(id));
    }

    private async success(
        orderNumber: string,
        orderID: string,
        userID: string,
        shoppingCartID: string,
        points: number
    ): Promise<void> {       
        await this.shoppingCartRepository.delete(shoppingCartID, userID);
        await this.loyaltyPointService.save(orderID, userID, points);
        await this.loyaltyPointService.redeem(userID, orderID);
        await this.redisService.publish(
            PubSubChannelKeys.EmailChannel,
            JSON.stringify([
                { key: 'emailType', value: EmailType.OrderConfirmation },
                { key: 'orderID', value: orderID },
                { key: 'userID', value: userID },
                { key: 'orderNumber', value: orderNumber },
            ])
        );
    }

    private async cancel(orderIDs: Array<string>, userID: string, shoppingCartID: string, multiOrderHeaderID: string = null): Promise<void> {
        await this.shoppingCartRepository.setPaymentInProgress(shoppingCartID, userID, false);

        for (const o of orderIDs) {
            await this.orderRepository.setStatus(o, OrderStatus.Failed, userID, OrderPaymentStatus.PaymentCancelled);    
        }

        if (multiOrderHeaderID) {
            await this.multiOrderHeaderRepository.setStatus(multiOrderHeaderID, OrderPaymentStatus.PaymentCancelled)
        }
    }
    
    private async pay(paymentRequest: PaymentRequest): Promise<string> {
        return new Promise((resolve, reject) => {
            request.post(
                `${process.env.PAYMENT_GATEWAY_HOST}/${process.env.PAYMENT_GATEWAY_PATH}`,
                { form: {...paymentRequest, service_provider: 'payu_paisa' }, headers: { authorization: process.env.PAYMENT_GATEWAY_MERCHANT_AUTH_HEADER } },
                (error, response) => {
                    if (error) {
                        reject(error);
                    }

                    if (response.headers.location){
                        resolve(response.headers.location);
                    } else {                    
                        reject('Error, initiating payment request');                    
                    }
                }
            );
        });
    }

    private isValidPaymentResponse(response: PaymentResponse): boolean {
        const key = process.env.PAYMENT_GATEWAY_MERCHANT_KEY;
        const salt = process.env.PAYMENT_GATEWAY_MERCHANT_SALT;

        let hashData = key+'|'+response.txnid+'|'+response.amount+'|'+response.productinfo+'|'+response.firstname+'|'+response.email+'|||||'+response.udf5+'|||||';
        hashData = salt+'|'+response.status+'|'+hashData.split('|').reverse().join('|');
        
        const hash = this.cryptoService.generatePaymentResponseHash(hashData);

        return response.hash === hash;
    }

    private async getOrderIDs(userID: string, orderID: string, orderNumber: string): Promise<Array<string>> {
        const isMultiOrder = orderNumber.startsWith('M-');
        const orderIDs = [];
        
        if (isMultiOrder) {
            const result: Result<Order> = await this.orderRepository.search(
                userID,
                1,
                { query: [{ Key: 'multiOrderHeaderID', Value: orderID}] },
                { _id: 1 });
            for (const o of result.items) {
                orderIDs.push(o._id.toString());
            }
        } else {
            orderIDs.push(orderID);
        }

        return orderIDs;
    }

    private async setOrderPaymentStatus(
        orderIDs: Array<string>,
        userID: string,
        isValid: boolean,
        paymentResponseID: string,
        shoppingCartID: string,
        multiOrderHeaderID?: string
    ): Promise<void> {
        const paymentStatus = isValid ? OrderPaymentStatus.PaymentSuccess : OrderPaymentStatus.PaymentFailure;
        await this.shoppingCartRepository.setPaymentInProgress(shoppingCartID, userID, false);

        for (const o of orderIDs) {
            await this.orderRepository.setStatus(
                o,
                isValid ? OrderStatus.Open : OrderStatus.Failed,
                userID,
                paymentStatus,
                paymentResponseID);    
        }
        if (multiOrderHeaderID) {
            await this.multiOrderHeaderRepository.setStatus(multiOrderHeaderID, paymentStatus, paymentResponseID);
        }
    }
}
