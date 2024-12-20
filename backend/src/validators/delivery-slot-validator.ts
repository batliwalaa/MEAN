import { Injectable } from '../core/decorators';
import { IValidator } from '../models/validator';
import { DeliverySlotKey, DeliverySlotType, ErrorMessage } from '../models';
import { Validators } from './validators';

@Injectable()
export class DeliverySlotValidator implements IValidator {
    constructor(private validators: Validators) {}

    async validate(key: DeliverySlotKey, deliverySlotType: DeliverySlotType): Promise<ErrorMessage[]> {
        const nameof = (obj: any) => Object.keys(obj)[0];

        const errors = await this.validators
            .isNotEmptyOrWhitespace(nameof({ deliverySlotType }), deliverySlotType)
            .isNotEmptyOrWhitespace('key.deliveryDate', key.deliveryDate.toString())
            .isNotEmptyOrWhitespace('key.startTime', key.startTime)
            .isNotEmptyOrWhitespace('key.endTime', key.endTime)
            .errors();

        return errors;
    }
}
