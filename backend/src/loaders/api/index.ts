import { Express } from 'express';
import expressLoader from './express';
import initializeDb from './initialize-db';
import { ConfigureLogger } from '../common/configure-logger';
import bootstrap from './bootstrap';

// @ts-ignore
export default async (app: Express, environment: Environment) => {
    await bootstrap();
    await initializeDb();
    await ConfigureLogger();
    await expressLoader(app, environment);
};
