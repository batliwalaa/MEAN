import { Model } from 'mongoose';
import { Injectable } from '../core/decorators';
import { StateCode } from '../models';
import StateCodeCollection from './collections/state-code.collection';
import { StateCodeModel } from './models/state-code.model';

@Injectable()
export class StateCodeRepository {
    private stateCodeCollection: Model<StateCodeModel, any>;

    constructor() {
        this.stateCodeCollection = StateCodeCollection();
    }

    public async getForCountry(country: string): Promise<Array<StateCode>> {
        return await this.stateCodeCollection.find({ country });
    }
}
