import connections from './mongo-connections';
import { Connection } from 'mongoose';

let dConnection: Connection;
let lConnection: Connection;
let sConnection: Connection;

// @ts-ignore
export const initialiseMongoConnections = async (environment: Environment) => {
    const c = await connections(environment);
    dConnection = c.databaseConnection();
    lConnection = c.loggingConnection();
    sConnection = c.sessionConnection();
};

export const DatabaseConnection = () => dConnection;
export const LoggingConnection = () => lConnection;
export const SessionConnection = () => sConnection;
