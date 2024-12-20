import { VerificationType } from './enums/verification-type';

export interface EmailVerify {
    _id: any;
    email: string;
    emailSentStatus: 'Success' | 'Failure';
    hash: string;
    dateSent: number;
    expires: number;
    active: boolean;
    verificationReceivedDate?: number;
    resend?: boolean;
    verificationType: VerificationType;
    sessionID?: string;
    emailResponse: any;
    test?: boolean;
}
