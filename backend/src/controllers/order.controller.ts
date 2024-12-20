import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { ActionResult } from '../core/action-results/action-result';
import { Catch, Controller, Injectable, Get, Validator, Patch } from '../core/decorators';
import { Authorize } from '../core/decorators/authorize.decorator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { MediatR } from '../core/mediator/MediatR';
import { OrderListRequest, GetOrderByIdRequest, UpdateOrderStatusRequest } from '../cqrs';
import { OrderStatus } from '../models';
import { OrderService, DeliverySlotService } from '../services';
import { OrderSearchValidator } from '../validators/order-search.validator';
import { ApiController } from './api.controller';

@Injectable()
@Controller('/order')
export default class OrderController extends ApiController {
    constructor(
        private orderService: OrderService,
        private deliverySlotService: DeliverySlotService) {
          super();
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get(['/search/:pn/:query'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['pn::number', 'query::string'])
    @Validator(OrderSearchValidator)
    async get(pn: number, query: string): Promise<ActionResult> {
        let searchMap = JSON.parse(Buffer.from(query, 'base64').toString('utf-8'));

        searchMap = { ...searchMap, from: (searchMap.from ? new Date(searchMap.from) : null), to: new Date(searchMap.to) };  

        const result = await MediatR.send(new OrderListRequest(
            pn, this.request.session.userID,  searchMap
        ));

        return this.Ok(result);
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get(['/:orderID'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['orderID::string'])
    async getByID(orderID: string): Promise<ActionResult> {    
        const result = await MediatR.send(new GetOrderByIdRequest(
            orderID,  this.request.session.userID
        ));

        return this.Ok(result);
    }
    
    @Authorize(['customer', 'admin', 'staff'])
    @Patch(['/:orderID'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['orderID::string', '@FromBody::status'])
    async setOrderStatus(orderID: string, status: OrderStatus): Promise<ActionResult> {
        const result = await MediatR.send(new UpdateOrderStatusRequest(
            orderID, status, this.request.session.userID
        ))
        return this.Ok(result);
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get(['/:orderID/product/:productID'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['orderID::string', 'productID::string'])
    async getOrderProduct(orderID: string, productID: string): Promise<ActionResult> {
        const result = await this.orderService.getOrderProduct(orderID, productID);

        return this.Ok(result);
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get(['/:orderID/products'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['orderID::string'])
    async getProductsByID(orderID: string): Promise<ActionResult> {
        const result = await this.orderService.getByOrderID(this.request.session.userID, orderID);

        return this.Ok(result && result.items || []);
    }
}
