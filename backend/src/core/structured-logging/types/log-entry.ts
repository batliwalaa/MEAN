export interface LogEntry {
    level: string;
    module: string;
    message: string;
    data?: any;
    error?: Error;
}
