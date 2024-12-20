import { Express, urlencoded, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import connectMongo from 'connect-mongo';
import { RegisterRoutes } from './register.routes';
import { MultipartMiddleware, RequestLogger, ResponseHeader, ValidateRequest } from '../../core/middleware';

// @ts-ignore
export default async (app: Express, environment: Environment) => {
    app.get('/status', (req: Request, res: Response) => {
        res.status(200).end();
    });

    app.head('/status', (req: Request, res: Response) => {
        res.status(200).end();
    });

    // useful if behind reverse proxy, shows real origin proxy in logs
    if (app.get('env') === 'production') {
        app.set('trust proxy', 1);
    }

    // enable cors to all origins by default @TODO: restrict
    app.use(cors({ origin: environment.cors.origin, credentials: true }));

    // allows use f HTTP verbs such as PUT / DELETE in places where client doesn't support it.
    //app.use(require('method-override'));

    const MongoStore = connectMongo(session);

    app.use(bodyParser.json({ type: 'application/vnd.api+json', limit: '15mb' }));
    app.use(urlencoded({ extended: true }));
    app.use(cookieParser(environment.siteKey));
    app.use(session({ ...environment.sessionOptions, store: new MongoStore({ url: environment.sessionDatabaseUrl }) }));
    app.use(RequestLogger());
    // app.use(VerifyRecaptcha());
    app.use(ValidateRequest());
    app.use(ResponseHeader());
    app.use(MultipartMiddleware());
    
    await RegisterRoutes(app, environment);
};
