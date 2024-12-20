import { Catch, Controller, Post, Injectable, Get, Validator } from '../core/decorators';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';
import { Authorize } from '../core/decorators/authorize.decorator';
import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';
import { DeliverySlotService } from '../services';
import { DeliverySlotKey, DeliverySlotType } from '../models';
import { DeliverySlotValidator } from '../validators/delivery-slot-validator';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Injectable()
@Controller('/delivery/slots')
export default class DeliverySlotController extends ApiController {
    constructor(private deliverySlotService: DeliverySlotService, private shoppingCartService: ShoppingCartService) {
        super();
    }

    @Authorize(['admin'])
    @Post(['/generate'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder([])
    async generate(): Promise<any> {
        await this.deliverySlotService.generateSlots(this.request.session.userID);
        return this.Ok();
    }

    @Authorize(['admin'])
    @Get(['/panchshil/:from/:to'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['from', 'to'])
    async panchshil(from: Date, to: Date): Promise<any> {
        return this.Ok(
            await this.deliverySlotService.getSlots(DeliverySlotType.Panchshil, new Date(from), new Date(to))
        );
    }

    @Authorize(['admin', 'customer', 'staff'])
    @Get(['/vehicle/:from/:to'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['from::number', 'to::number'])
    async vehicle(from: number, to: number): Promise<any> {
        const slots = await this.deliverySlotService.getSlots(DeliverySlotType.Vehicle, new Date(from), new Date(to));
        const selectedSlot = await this.deliverySlotService.getSelectedSlotForShoppingCartID(
            this.request.session.shoppingCartID
        );

        if (selectedSlot) {
            const slot = slots.find(
                (s) =>
                    s.deliveryDate.getTime() === selectedSlot.deliveryDate.getTime() &&
                    s.startTime === selectedSlot.startTime &&
                    s.endTime === selectedSlot.endTime
            );

            if (slot) {
                slot.selected = true;
                slot.reserveStateExpiresIn = selectedSlot.reserveStateExpiresIn;
            }
        }
        return this.Ok(slots);
    }

    @Authorize(['admin', 'customer', 'staff'])
    @Post(['/reserve'])
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['@FromBody::key', '@FromBody::deliverySlotType'])
    @Validator(DeliverySlotValidator)
    async reserve(key: DeliverySlotKey, deliverySlotType: DeliverySlotType): Promise<any> {
        if (!this.request.session.shoppingCartID) {
            return this.BadRequest();
        }

        const result = await this.deliverySlotService.reserve(
            { ...key, deliveryDate: new Date(key.deliveryDate), shoppingCartID: this.request.session.shoppingCartID },
            this.request.session.userID,
            deliverySlotType
        );

        if (result) {
            await this.shoppingCartService.updateSlot(
                this.request.session.shoppingCartID,
                result._id.toString(),
                deliverySlotType
            );

            return this.Ok(result);
        }

        return this.NotFound();
    }
}
