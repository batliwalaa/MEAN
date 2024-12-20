import { KeyValuePair } from "./key-value-pair";

export interface StateCode {
    _id: any;
    version: string;
    active: boolean;
    country: string;
    codes: Array<KeyValuePair<any>>
}