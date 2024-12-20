import { AddressType } from './enums/address-type';

export interface Address {
    _id: any;
    userID: string;
    country: string;
    postcode?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    town?: string;
    state?: string;
    addressType?: AddressType;
    isDefaultAddress?: boolean;
    instructions?: string;
    code?: number;
    test?: boolean;
    stateUTCode?: number;
}
