import { LogManager } from '../log-manager';
import { ProcessEnreacher } from '../process-enricher';
import { LoggingRepository } from '../../../repositories/logging-repository';
import { Injector } from '../../di/injector';
import { Lock } from '../../lock/lock';
import { LoggingItem } from '../../../models';

export class MongoSink {
    private lock: Lock;

    constructor(
        private logManager: LogManager,
        private processEnricher: ProcessEnreacher,
        private loggingRepository: LoggingRepository
    ) {
        this.processEnricher = new ProcessEnreacher();
        this.loggingRepository = new LoggingRepository();
        // @ts-ignore
        this.environment = Injector.getEnvironmentInstance();
        this.lock = Injector.resolve<Lock>(Lock);
        this.init();
    }
    private _loggingMessages: Array<any> = [];
    // @ts-ignore
    private environment: Environment;
    private init(): void {
        this.logManager.onLogEntry((logEntry) => {
            let enrichers: string = '';
            let action: string = '';

            const en = this.processEnricher.getEventItems();
            en.forEach((e) => {
                enrichers += `[${e.key}=${e.value}] `;
            });

            if (logEntry.data) {
                action = logEntry.data['action'];
            }

            const message: LoggingItem = {
                _id: null,
                loggingMessage: `${logEntry.level}: ${enrichers} [${logEntry.module} ${action ? ' - ' + action : ''}] [${logEntry.message}] ${logEntry.error ? '[' + logEntry.error + ']' : ''}`,
                data: logEntry?.data
            };
            this._loggingMessages.push(message);

            this.lock.acquire('mongo-sink-logging');
            if (this._loggingMessages.length === this.environment.defaultLoggingBatchNumber) {
                this.loggingRepository.insertLog(this._loggingMessages);
                this._loggingMessages = [];
            }
            this.lock.release('mongo-sink-logging');
        });
    }
}
