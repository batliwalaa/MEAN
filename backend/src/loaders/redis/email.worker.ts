import { RedisService } from '../../cache';
import { PubSubChannelKeys } from '../../keys/redis-pub-sub-channel.keys';
import { EmailService } from '../../services';
import { Injector } from '../../core/di/injector';

export default async () => {
    const redisService = Injector.resolve<RedisService>(RedisService);
    const emailService = Injector.resolve<EmailService>(EmailService);

    await redisService.subscribe(PubSubChannelKeys.EmailChannel, async (channel: string, message: string) => {
        if (channel !== PubSubChannelKeys.EmailChannel) return;

        const msg = JSON.parse(message);

        if (msg) {
            await emailService.sendEmail(msg);
        }
    });
};
