import { IHandler } from '../../core/mediator/handler';
import { PaymentCompleteRequest, PaymentCompleteResponse } from '../';
import { Injectable } from '../../core/decorators';
import { PaymentService } from '../../services';
import { RedisService } from '../../cache';
import { PubSubChannelKeys } from '../../keys/redis-pub-sub-channel.keys';
import { OrderPaymentStatus } from '../../models';

@Injectable()
export class PaymentCompleteHandler implements IHandler<PaymentCompleteRequest, PaymentCompleteResponse> {
    constructor(
        private paymentService: PaymentService,
        private redisService: RedisService
    ) {
    }
    public async handle(request: PaymentCompleteRequest): Promise<any> {
        const result = await this.paymentService.complete (
            request.orderID,
            request.userID,
            request.shoppingCartID,
            request.paymentResponse,
            request.orderNumber);

        if (result.status === OrderPaymentStatus.PaymentSuccess) {
            await this.redisService.publish(
                PubSubChannelKeys.InvoiceGenerateChannel, 
                JSON.stringify({
                    orderID: request.orderID,
                    userID: request.userID
                })
            );
        }
        
        return result;
    }
}
