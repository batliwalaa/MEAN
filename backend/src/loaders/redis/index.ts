import preLoadCache from './preLoadCache';
import cacheWorker from './cacheWorker';
import verificationWorker from './verification.worker';
import { ConfigureLogger } from '../common/configure-logger';
import { CacheManager } from '../../cache/cache.manager';
import { RedisService } from '../../cache';
import bootstrap from './bootstrap';
import deliverySlotManagerWorker from './delivery-slot-manager.worker';
import { InvoiceGenerationWorker  } from './invoice-generation.worker';
import { CreditNoteGenerationWorker } from './credit-note-generation.worker';
import { MetadataLoader } from '../common/meta-data.loader';

// @ts-ignore
export default async (environment: Environment) => {
    await bootstrap();

    const redisService = new RedisService();
    const cacheManager = new CacheManager(redisService);

    await MetadataLoader('redis');
    await cacheManager.delete('*');
    await ConfigureLogger();
    await cacheWorker(environment);
    await preLoadCache();
    await verificationWorker();
    await deliverySlotManagerWorker();
    await InvoiceGenerationWorker();
    await CreditNoteGenerationWorker();
};
