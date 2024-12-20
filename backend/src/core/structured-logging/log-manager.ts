import { EventEmitter } from 'events';
import { LogOptions } from './types/log-options';
import { Logger } from './logger';
import { LogEntry } from './types/log-entry';

export class LogManager extends EventEmitter {
    private sinks: Array<any> = [];

    private options: LogOptions = {
        minLevels: {
            '': 'info',
        },
    };

    public configure(options?: LogOptions): LogManager {
        this.options = Object.assign({}, this.options, options);
        return this;
    }

    public addSink(sink: any): LogManager {
        const s = new sink(this);
        this.sinks.push(s);

        return this;
    }

    public getLogger(module: string): Logger {
        let minLevel = 'none';
        let match = '';

        for (const key in this.options.minLevels) {
            if (module.startsWith(key) && key.length >= match.length) {
                minLevel = this.options.minLevels[key];
                match = key;
            }
        }

        return new Logger(this, module, minLevel);
    }

    public onLogEntry(listener: (logEntry: LogEntry) => void): LogManager {
        this.on('log', listener);
        return this;
    }
}

const lm = new LogManager();

export const Logging = lm;
