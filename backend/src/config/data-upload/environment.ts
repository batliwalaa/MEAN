import { Injectable } from '../../core/decorators';

@Injectable()
export class Environment {
    public get port(): number {
        return Number(process.env.PORT);
    }

    public get databaseUri(): string {
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
    
    public get defaultLoggingBatchNumber(): number {
        return Number(process.env.DEFAULT_LOGGER_BATCH_SIZE);
    }
}
