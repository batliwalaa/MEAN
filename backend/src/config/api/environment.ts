import { Injectable } from '../../core/decorators';
import path from 'path';

@Injectable()
export class Environment {
    public get siteKey(): string {
        return Buffer.from(process.env.COOKIE_KEY).toString();
    }

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

    public get pageSize(): number {
        return Number(process.env.PAGE_SIZE);
    }

    public get logLevel(): string {
        return process.env.LOG_LEVEL;
    }

    public get cachingEnabled(): boolean {
        return /true/i.test(process.env.CACHING_ENABLED);
    }

    public get defaultCacheTTLInSeconds(): number {
        return Number(process.env.DEFAULT_CACHE_TTL_IN_SECONDS);
    }

    public get api(): any {
        return { prefix: process.env.API_PREFIX };
    }

    public get cors(): any {
        return { origin: process.env.CORS };
    }

    public get passphrase(): string {
        return process.env.X509_CERT_PASSPHRASE;
    }

    public get defaultLoggingBatchNumber(): number {
        return Number(process.env.DEFAULT_LOGGER_BATCH_SIZE);
    }

    public get passwordSalt(): string {
        return process.env.PASSWORD_SALT;
    }

    public get sessionOptions(): any {
        return {
            secret: this.siteKey,
            name: process.env.COOKIE_NAME,
            resave: false,
            saveUninitialized: true,
            // proxy: true,
            cookie: {
                maxAge: 1000 * Number(process.env.COOKIE_MAXAGE),
                secure: /true/i.test(process.env.COOKIE_SECURE),
                domain: process.env.COOKIE_DOMAIN,
                sameSite: process.env.COOKIE_SAMESITE,
                httpOnly: /true/i.test(process.env.COOKIE_HTTPONLY),
            },
        };
    }

    public get tokenAlgorithm(): string {
        return process.env.TOKEN_ALGORITHM;
    }

    public get tokenExpiresIn(): string {
        return process.env.TOKEN_EXPIRESIN;
    }

    public get refreshTokenExpiresIn(): string {
        return process.env.REFRESH_TOKEN_EXPIRESIN;
    }

    public get tokenIssuer(): string {
        return process.env.TOKEN_ISSUER;
    }

    public get tokenAudience(): string {
        return process.env.TOKEN_AUDIENCE;
    }

    public get loyaltyEnabled(): boolean {
        return /true/i.test(process.env.LOYALTY_ENABLED);
    }
}
