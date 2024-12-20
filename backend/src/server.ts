import 'reflect-metadata';
import express, { Express } from 'express';
import https from 'https';
import http from 'http';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';

import { initialiseMongoConnections } from './core/connections';
import { Injector } from './core/di/injector';
import { Environment } from './config/api/environment';

// @ts-ignore
global.appRoot = path.resolve(__dirname);
import IMAGE_PATH from './constants/image-path.constant';

async function startServer() {
    Injector.registerSingleton<Environment>(Environment);
    const enviroment = Injector.resolveSingleton<Environment>(Environment);
    Injector.registerEnvironmentInstance(enviroment);
    const app: Express = express();

    app.use('/resource/images', express.static(IMAGE_PATH));

    await initialiseMongoConnections(enviroment);

    // @ts-ignore
    await require('./loaders/api').default(app, enviroment);
    
    if (process.env.USE_HTTPS === 'true') {
        https
            .createServer(
                {
                    key: fs.readFileSync(path.join(__dirname, '/../../nginx/ssl/key.pem')),
                    cert: fs.readFileSync(path.join(__dirname, '/../../nginx/ssl/cert.pem')),
                    passphrase: enviroment.passphrase,
                },
                app
            )
            .listen(enviroment.port);
    } else {
        http.createServer({}, app).listen(enviroment.port);
    }    
}

async function setEnvironmentVariables() {
    try {
        const envConfig = dotenv.parse(fs.readFileSync(path.join(__dirname, '../src/config/api/.env')));
        for (const k in envConfig) {
            process.env[k] = envConfig[k];
        }
    } catch { }
}

setEnvironmentVariables();
startServer();
