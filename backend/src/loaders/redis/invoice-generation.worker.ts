import { RedisService } from '../../cache';
import { PubSubChannelKeys } from '../../keys/redis-pub-sub-channel.keys';
import { Injector } from '../../core/di/injector';
import { MediatR } from '../../core/mediator/MediatR';
import { InvoiceGenerateRequest } from '../../cqrs';
import { Logger } from '../../core/structured-logging/logger';
import { Logging } from '../../core/structured-logging/log-manager';
import { schedule } from 'node-cron';
import { OrderService } from '../../services';

const InvoiceGenerationWorker = async () => {
    const logger: Logger = Logging.getLogger('invoice-generation.worker');
    const redisService = Injector.resolve<RedisService>(RedisService);
    const orderService = Injector.resolve<OrderService>(OrderService);
    const send = async (request: InvoiceGenerateRequest): Promise<void> => {
        try {
            await MediatR.send<void>(request);
        } catch (e) {
            logger.error(`ERROR: Invoice generation orderID: ${request.orderID}`, request, e);
        }
    }

    await redisService.subscribe(PubSubChannelKeys.InvoiceGenerateChannel, async (channel: string, message: string) => {
        if (channel !== PubSubChannelKeys.InvoiceGenerateChannel) return;
        const msg: { orderID: string, userID: string } = JSON.parse(message);

        send(new InvoiceGenerateRequest(msg.userID, msg.orderID));
    });

    /* 
        // TEST ONLY
        await redisService.publish(PubSubChannelKeys.InvoiceGenerateChannel, 
        JSON.stringify({
            orderID: '5fc5bf08e929282e66008af0',
            userID: '5f9bb829c80c6003947b4356'
        })); */

    schedule('* * * * *', async () => {
        const orders = await orderService.getOrdersReadyForInvoicing();

        for (const o of orders) {
            send(new InvoiceGenerateRequest(o.userID, o.orderID));
        }
    });
};

export { InvoiceGenerationWorker };