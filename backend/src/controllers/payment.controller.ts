import { Catch, Controller, Injectable, Post, Validator } from '../core/decorators';
import { ApiController } from './api.controller';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { Authorize } from '../core/decorators/authorize.decorator';
import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';
import { PaymentRequestValidator } from '../validators/payment-request-validator';
import { PaymentResponse } from '../models';
import { ActionResult } from '../core/action-results/action-result';
import { MediatR } from '../core/mediator/MediatR';
import { CreateOrderRequest, CreateOrderResponse, PaymentCompleteRequest } from '../cqrs';

@Injectable()
@Controller('/payment')
export default class PaymentController extends ApiController {
    constructor(      
    ) {
        super();
    }

    @Authorize(['customer'])
    @Post(['/initiate'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['@FromBody::addressID', '@FromBody::amount', '@FromBody::promotions', '@FromBody::pointsToRedeem'])
    @Validator(PaymentRequestValidator)
    async initiate(
        addressID: string,
        amount: string,
        promotions: Array<string>,
        pointsToRedeem: number
    ) : Promise<ActionResult> {
        const response: CreateOrderResponse = await MediatR.send(new CreateOrderRequest(
            addressID,
            amount,
            promotions,
            pointsToRedeem,
            this.request.session.userID,
            this.request.session.shoppingCartID,
            this.request.sessionID
        ));

        if (!response) {
            return this.BadRequest();
        } else if (response && response.valid !== null && response.valid !== undefined) {
            return this.BadRequest({ name: 'InvalidRedeemPoints', pointsToRedeem: pointsToRedeem, availablePoints: response.availablePoints });
        } else {
            this.request.session.orderID = response.id;
            this.request.session.orderNumber = response.orderNumber;

            if (response && response.url) {
                return this.Ok({ url: response.url });
            } else {
                return this.Ok(response)
            }
        }
    }

    @Post(['/response'])
    @Catch()
    @ModelBinder([
        '@FromBody::response'
    ])
    async success(response: PaymentResponse): Promise<ActionResult> {
        const result = await MediatR.send(new PaymentCompleteRequest(
            this.request.session.orderID,
            this.request.session.userID,
            this.request.session.shoppingCartID,
            this.request.session.orderNumber,
            response
        ));       
        
        return this.Ok(result);
    }
}
