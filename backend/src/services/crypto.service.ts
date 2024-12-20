import { compare, genSalt, hash } from 'bcryptjs';
import crypto from 'crypto';
import { Injectable } from '../core/decorators';
import { Injector } from '../core/di/injector';
import { PaymentRequest } from '../models';

@Injectable()
export class CryptoService {
    private environment: any;

    constructor() {
        this.environment = Injector.getEnvironmentInstance();
    }

    public async hash(data: string): Promise<string> {
        const salt = await genSalt(Number(this.environment.passwordSalt));

        return await hash(data, salt);
    }

    public async compare(data: string, hashedData: string): Promise<boolean> {
        return await compare(data, hashedData);
    }

    public generateHashForPayment(request: PaymentRequest): string {
        const key = process.env.PAYMENT_GATEWAY_MERCHANT_KEY;
        const salt = process.env.PAYMENT_GATEWAY_MERCHANT_SALT;
        const h = key +'|'+request.txnid+'|'+request.amount+'|'+'Amreet Bazaar'+'|'+request.firstname+'|'+request.email+'|||||'+request.udf5+'||||||'+salt;
        const cryp = crypto.createHash('sha512');

        cryp.update(h);

        return cryp.digest('hex');
    }

    public generatePaymentResponseHash(data: string): string {
        const cryp = crypto.createHash('sha512');

        cryp.update(data);

        return cryp.digest('hex');
    }
}
