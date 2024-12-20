import { ActionResult } from '../core/action-results/action-result';
import { Catch, Controller, Injectable, ModelBinder, Post } from '../core/decorators';
import { ShoppingCart } from '../models';
import { ShoppingCartService } from '../services/shopping-cart.service';
import { ApiController } from './api.controller';

@Injectable()
@Controller('/shopping/cart')
export default class ShoppingCartController extends ApiController {
    constructor(private shoppingCartService: ShoppingCartService) {
        super();
    }

    @Post(['/session'])
    @Catch()
    @ModelBinder([])
    async cartBySession(): Promise<ActionResult> {
        let cart = await this.shoppingCartService.getBySessionID(this.request.sessionID);

        if ((!cart || !cart._id) && this.request.session.userID) {
            cart = await this.shoppingCartService.getByUserID(this.request.session.userID);
            if (cart && cart._id) {
                cart.sessionID = this.request.sessionID;            
                await this.shoppingCartService.updateSessionID(cart._id, this.request.sessionID);
            }
        }

        if (!cart || !cart._id) {
            cart = await this.shoppingCartService.create(this.request.sessionID, this.request.session.userID);
        }

        this.request.session.shoppingCartID = cart._id;
        return this.Ok(cart);
    }

    @Post(['/update'])
    @Catch()
    @ModelBinder(['@FromBody::cart'])
    async update(cart: ShoppingCart): Promise<ActionResult> {
        if (cart && cart.sessionID === this.request.sessionID) {
            await this.shoppingCartService.update(cart);
        }

        return this.Ok();
    }
}
