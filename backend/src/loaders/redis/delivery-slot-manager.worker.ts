import { schedule } from 'node-cron';
import { RedisService } from '../../cache';
import { PubSubChannelKeys } from '../../keys/redis-pub-sub-channel.keys';
import { DeliverySlotService } from '../../services';
import { Injector } from '../../core/di/injector';

export default async () => {
    const redisService = Injector.resolve<RedisService>(RedisService);
    const deliverySlotService = Injector.resolve<DeliverySlotService>(DeliverySlotService);

    await redisService.subscribe(PubSubChannelKeys.DeliverySlotManagerChannel, async (channel: string, _: string) => {
        if (channel !== PubSubChannelKeys.DeliverySlotManagerChannel) return;

        await deliverySlotService.clearExpiredReservedSlots();
    });

    schedule('* * * * *', async () => {
        await redisService.publish(PubSubChannelKeys.DeliverySlotManagerChannel, '');
    });
};
