import { EnricherEventItem } from './enricher-event-item';

export interface LoggerEnricher {
    getEventItems(): Array<EnricherEventItem>;
}
