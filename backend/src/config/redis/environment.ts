import { Injectable } from '../../core/decorators';

@Injectable()
export class Environment {
    public get port(): number {
        return Number(process.env.PORT);
    }

    public get defaultDatabaseUrl(): string {
        return process.env.AMREET_BAZAAR_DATABASE;
    }

    public get sessionDatabaseUrl(): string {
        return process.env.SESSION_DATABASE;
    }

    public get loggingDatabaseUrl(): string {
        return process.env.LOGGING_DATABASE;
    }

    public get logLevel(): string {
        return process.env.LOG_LEVEL;
    }

    public get defaultCacheTTLInSeconds(): number {
        return Number(process.env.DEFAULT_CACHE_TTL_IN_SECONDS);
    }

    public get defaultLoggingBatchNumber(): number {
        return Number(process.env.DEFAULT_LOGGER_BATCH_SIZE);
    }

    public get cachingEnabled(): boolean {
        return /true/i.test(process.env.CACHING_ENABLED);
    }
}
