import 'reflect-metadata';
import express, { Express } from 'express';
import http from 'http';
import fs from 'fs';
import dotenv from 'dotenv';
import cache from './cache';
import { Injector } from './core/di/injector';
import { initialiseMongoConnections } from './core/connections';
import path from 'path';

import { Environment } from './config/redis/environment';

// @ts-ignore
global.appRoot = path.resolve(__dirname);

async function startServer() {
    Injector.registerSingleton<Environment>(Environment);

    const enviroment = Injector.resolveSingleton<Environment>(Environment);
    Injector.registerEnvironmentInstance(enviroment);
    const app: Express = express();

    await initialiseMongoConnections(enviroment);
    // @ts-ignore
    await cache();
    await require('./loaders/redis').default(app);

    http.createServer({}, app).listen(enviroment.port);
}

async function setEnvironmentVariables() {
    try {
        const envConfig = dotenv.parse(fs.readFileSync(path.join(__dirname, '../src/config/redis/.env')));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    } catch (e){
        console.log(e)
    }
}
setEnvironmentVariables();
startServer();
