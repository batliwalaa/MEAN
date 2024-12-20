import { Address } from "./address";
import { KeyValuePair } from "./key-value-pair";

export interface Seller {
    _id: any;
    name: string;
    address: Address;
    stateUTCode: KeyValuePair<string>;
    registrationDetails: Array<KeyValuePair<any>>;
}