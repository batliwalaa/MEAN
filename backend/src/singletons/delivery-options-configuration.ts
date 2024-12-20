import fs from 'fs';
import { Injectable } from '../core/decorators';
import { IDeliveryOptions } from '../models';

@Injectable()
export default class DeliveryOptionsConfiguration {
    private _options: IDeliveryOptions;
    private _initialised: boolean;

    public initialize(): void {
        const options = fs.readFileSync(`${__dirname}/../../src/config/api/delivery-options.config.json`, {
            encoding: 'utf-8',
        });

        if (options) {
            this._options = JSON.parse(options);
            this._initialised = true;
        }
    }

    public get isInitialised(): boolean {
        return this._initialised;
    }

    public get options(): IDeliveryOptions {
        return this._options;
    }

    public get FreeDeliveryOrderValue(): number {
        return this._options.freeDeliveryMinOrderValue;
    }
}
