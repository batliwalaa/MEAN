export interface PaymentRequest {
    firstname: string;
    email: string;
    phone: string;
    productinfo: string;
    amount: string;
    txnid: string;
    surl: string;
    furl: string;
    udf5: string;
    key: string;
    hash?: string;
}
