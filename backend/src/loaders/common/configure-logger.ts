import { ConsoleSink } from '../../core/structured-logging/sinks/console-sink';
import { Logging } from '../../core/structured-logging/log-manager';
import { MongoSink } from '../../core/structured-logging/sinks/mongo-sink';

export const ConfigureLogger = async (): Promise<void> => {
    Logging.configure().addSink(ConsoleSink).addSink(MongoSink);

    return Promise.resolve();
};
