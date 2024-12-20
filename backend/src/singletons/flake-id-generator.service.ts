import { Injectable } from "../core/decorators";
import FlakeId from "flake-idgen";
// @ts-ignore
import intFormat from 'biguint-format';

@Injectable()
export class FlakeIdGeneratorService {
    private _generator: FlakeId
    private _initialised: boolean;

    constructor() {
        const datacenter = Number(process.env.DATAECNTER);
        const worker = Number(process.env.WORKER);
        this._generator = new FlakeId({
            datacenter, worker
        });
    }

    public initialize(): void {
        this._initialised = true;
    }
    public get isInitialised(): boolean {
        return this._initialised;
    }

    public next(): string {        
        return intFormat(this._generator.next(), 'dec');
    }
}