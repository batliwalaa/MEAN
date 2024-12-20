import { LoginMode } from './enums/login-mode';

export interface UserToken {
    _id: any;
    token: string;
    refresh: string;
    active: boolean;
    email: string;
    mobile: string;
    isoCode: string;
    mode: LoginMode;
    test?: boolean;
}
