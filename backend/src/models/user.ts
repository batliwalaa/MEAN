import { Address } from './address';

export interface User {
    _id: any;
    isoCode?: string;
    mobile?: string;
    emailId?: string;
    password?: string;
    active?: boolean;
    roles?: Array<string>;
    firstName?: string;
    lastName?: string;
    country?: string;
    primaryAddress?: Address;
    preferredLanguage?: string;
    emailVerified?: boolean;
    mobileVerified?: boolean;
    failedLoginCount?: number;
    previousPasswords?: Array<string>;
    test?: boolean;
}
