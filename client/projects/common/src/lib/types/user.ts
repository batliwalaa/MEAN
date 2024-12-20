export interface User {
    emailId?: string;
    roles?: Array<string>;
    firstName?: string;
    lastName?: string;
    country?: string;
    authenticated: boolean;
}
