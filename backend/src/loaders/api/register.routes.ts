import { Express, Request, Response } from 'express';
import { RouteDefinition } from '../../models';
import { Injector } from '../../core/di/injector';
import {
    AddressController,
    CacheController,
    DataController,
    FooterController,
    HomeController,
    MenuController,
    ProductController,
    UserController,
    AuthController,
    VerifyController,
    SessionController,
    ShoppingCartController,
    DeliveryOptionsController,
    DeliverySlotController,
    PaymentController,
    ResourceController,
    LoyaltyPointController,
    OrderController,
    ProductReviewController,
    FileController,
    StatusController
} from '../../controllers';

// @ts-ignore
const RegisterRoutes = async (app: Express, environment: IEnvironment) => {
    [
        HomeController,
        CacheController,
        DataController,
        FooterController,
        ProductController,
        MenuController,
        UserController,
        AddressController,
        AuthController,
        VerifyController,
        SessionController,
        ShoppingCartController,
        DeliveryOptionsController,
        DeliverySlotController,
        PaymentController,
        ResourceController,
        LoyaltyPointController,
        OrderController,
        ProductReviewController,
        FileController,
        StatusController
    ].forEach((controller) => {
        const instance = Injector.resolve(controller);
        const controllerPrefix = Reflect.getMetadata('prefix', controller);
        const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);

        routes.forEach((route) => {
            const r = environment.api.prefix + controllerPrefix + route.path;

            app[route.requestMethod](r, async (req: Request, res: Response) => {
                // @ts-ignore
                instance[route.methodName](req, res);
            });
        });
    });
};

export { RegisterRoutes };
