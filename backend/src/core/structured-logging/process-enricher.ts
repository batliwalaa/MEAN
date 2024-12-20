import { LoggerEnricher } from './types/logger-enricher';
import { EnricherEventItem } from './types/enricher-event-item';

export class ProcessEnreacher implements LoggerEnricher {
    getEventItems(): Array<EnricherEventItem> {
        const d = new Date();

        return [
            {
                key: 'time stamp',
                value: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}-${d.getHours()}-${d.getMinutes()}-${d.getSeconds()}-${d.getMilliseconds()}`,
            },
            { key: 'environment', value: process.env.NODE_ENV || 'dev' },
            { key: 'pid', value: process.pid.toString() },
        ];
    }
}
