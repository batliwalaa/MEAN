import { IHandler } from '../../core/mediator/handler';
import { CreateOrderRequest } from '../';
import { Injectable } from '../../core/decorators';
import { LoyaltyPointService, OrderService, PaymentService } from '../../services';
import { OrderPaymentStatus } from '../../models/enums/order-payment-status';
import { CreateOrderResponse } from '../';

@Injectable()
export class CreateOrderHandler implements IHandler<CreateOrderRequest, CreateOrderResponse> {
    constructor(
        private orderService: OrderService,
        private loyaltyPointService: LoyaltyPointService,
        private paymentService: PaymentService
    ) {
    }
    public async handle(request: CreateOrderRequest): Promise<any> {
        const state = await this.loyaltyPointService.validateRedeemPoints(request.userID, request.pointsToRedeem);

        if (!state.valid) {
            return { valid: state.valid, availablePoints: state.availablePoints, pointsToRedeem: request.pointsToRedeem };
        }

        const order: {id: string, amount: number, orderNumber: string, isMultiOrder: boolean} = 
            await this.orderService.create(
                request.shoppingCartID,
                OrderPaymentStatus.PaymentInProgress,
                null,
                request.addressID,
                request.userID,
                request.sessionID,
                request.userID,
                request.promotions,
                request.pointsToRedeem,
                request.amount);

        const response = await this.paymentService.initiate(request.userID, order.id, order.amount);
        await this.loyaltyPointService.reserve(request.userID, order.id.toString(), request.pointsToRedeem);       

        if (process.env.PAYMENT_GATEWAY_MODE === 'redirect') {
            return { url: response, id: order.id, orderNumber: order.orderNumber, isMultiOrder: order.isMultiOrder };
        } else {
            return {...response, id: order.id, orderNumber: order.orderNumber, isMultiOrder: order.isMultiOrder };
        }
    }
}
