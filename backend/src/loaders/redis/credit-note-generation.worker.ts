import { RedisService } from '../../cache';
import { PubSubChannelKeys } from '../../keys/redis-pub-sub-channel.keys';
import { Injector } from '../../core/di/injector';
import { MediatR } from '../../core/mediator/MediatR';
import { CreditNoteGenerateRequest } from '../../cqrs';
import { Logger } from '../../core/structured-logging/logger';
import { Logging } from '../../core/structured-logging/log-manager';
import { schedule } from 'node-cron';
import { OrderService } from '../../services';

const CreditNoteGenerationWorker = async () => {
    const logger: Logger = Logging.getLogger('credit-note-generation.worker');
    const redisService = Injector.resolve<RedisService>(RedisService);
    const orderService = Injector.resolve<OrderService>(OrderService);

    await redisService.subscribe(PubSubChannelKeys.CreditNoteGenerateChannel, async (channel: string, message: string) => {
        if (channel !== PubSubChannelKeys.CreditNoteGenerateChannel) return;
        const msg: { orderID: string, userID: string } = JSON.parse(message);

        send(new CreditNoteGenerateRequest(msg.orderID, msg.userID));
    });

    const send = async (request: CreditNoteGenerateRequest): Promise<void> => {
        try {
            await MediatR.send<void>(request);
        } catch (e) {
            logger.error(`ERROR: Credit Note generation orderID: ${request.orderID}`, request, e);
        }
    }
/* 
    await redisService.publish(PubSubChannelKeys.CreditNoteGenerateChannel, 
        JSON.stringify({
            orderID: '5fc5bf08e929282e66008af0',
            userID: '5f9bb829c80c6003947b4356'
        }));
 */
    schedule('* * * * *', async () => {
        const orders = await orderService.getOrdersForCreditNote();

        for (const o of orders) {
            send(new CreditNoteGenerateRequest(o.orderID, o.userID));
        }
    });
};

export {
    CreditNoteGenerationWorker
};