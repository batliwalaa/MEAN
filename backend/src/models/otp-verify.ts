import { VerificationType } from './enums/verification-type';

export interface OtpVerify {
    _id: any;
    mobile?: string;
    isoCode?: string;
    smsSentStatus: 'Success' | 'Failure';
    smsSentGatewayResponse: string;
    dateSent: number;
    verificationReceivedDate?: number;
    active: boolean;
    resend?: boolean;
    code: string;
    verificationType: VerificationType;
    expires: number;
    sessionID: string;
    test?: boolean;
    emailID?: string;
}
