export interface Address {
    _id?: string;
    country?: string;
    postcode?: string;
    addressLine1?: string;
    addressLine2?: string;
    addressLine3?: string;
    town?: string;
    state?: string;
    addressType?: string;
    isDefaultAddress?: boolean;
    instructions?: string;
    code?: number;
}
