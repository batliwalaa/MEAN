import { LogManager } from '../log-manager';
import { ProcessEnreacher } from '../process-enricher';

export class ConsoleSink {
    constructor(private logManager: LogManager, private processEnricher: ProcessEnreacher) {
        this.processEnricher = new ProcessEnreacher();
        this.init();
    }

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

            const msg = `${logEntry.level}: ${enrichers} [${logEntry.module} ${action ? ' - ' + action : ''}] [${logEntry.message}] ${logEntry.error ? '[' + logEntry.error + ']' : ''}`;
            console.error(msg);
        });
    }
}
