import fs from 'fs';
import { Injectable } from '../core/decorators';
import { ProductMapping } from '../models';

@Injectable()
export default class ProductMappingConfiguration {
    private _mappings: Array<ProductMapping>;
    private _initialised: boolean;

    public initialize(): void {
        const mappings = fs.readFileSync(`${__dirname}/../../src/config/api/product-mapping.json`, {
            encoding: 'utf-8',
        });

        if (mappings) {
            this._mappings = JSON.parse(mappings);
            this._initialised = true;
        }
    }

    public get isInitialised(): boolean {
        return this._initialised;
    }

    public get mappings(): Array<ProductMapping> {
        return this._mappings;
    }

    public get categories(): Array<string> {
        return this._mappings.filter(m => m.key === 'category').map(m => m.value);
    }
}
