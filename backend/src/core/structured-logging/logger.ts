import { EventEmitter } from 'events';
import { ProcessEnreacher } from './process-enricher';
import { LogEntry } from './types/log-entry';

export class Logger {
    private logManager: EventEmitter;
    private minLevel: number;
    private module: string;
    private readonly levels: { [key: string]: number } = {
        trace: 1,
        debug: 2,
        info: 3,
        warn: 4,
        error: 5,
    };

    constructor(logManager: EventEmitter, module: string, minLevel: string) {
        this.logManager = logManager;
        this.module = module;
        this.minLevel = this.levelToInt(minLevel);
    }

    public log(logLevel: string, message: string, data?: any, error?: Error) {
        const level = this.levelToInt(logLevel);
        const logEntry: LogEntry = { level: logLevel, module: this.module, message: message };

        if (data) {
            logEntry['data'] = data;
        }

        if (error) {
            logEntry['error'] = error;
        }

        /* 
        const error = new Error('');
        if (error.stack) {
            const cla = error.stack.split('\n');
            let idx = 1;
            while (idx < cla.length && cla[idx].includes('at logger.Object.')) idx++;
            if (idx < cla.length) {
                logEntry.location = cla[idx].slice(cla[idx].indexOf('at ') + 3, cla[idx].length);
            }
        }   */

        this.logManager.emit('log', logEntry);
    }

    public trace(message: string, data?: any): void {
        this.log('trace', message);
    }
    public debug(message: string, data?: any): void {
        this.log('debug', message, data);
    }
    public info(message: string, data?: any): void {
        this.log('info', message, data);
    }
    public warn(message: string, data?: any): void {
        this.log('warn', message, data);
    }
    public error(message: string, data?: any, error?: Error): void {
        this.log('error', message, data, error);
    }

    private levelToInt(minLevel: string): number {
        if (minLevel.toLowerCase() in this.levels) {
            return this.levels[minLevel.toLowerCase()];
        } else {
            return 99;
        }
    }
}
