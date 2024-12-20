import https from 'https';

import { Injectable } from '../core/decorators';

@Injectable()
export class SmsGatewayService {
    public async sendOtp(message: string, number: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            const test = process.env.SMS_GATEWAY_TEST === 'true' ? '&test=true' : '';
            const queryParameters = encodeURIComponent(
                `apikey=${process.env.SMS_GATEWAY_APIKEY}&numbers=${number}&message=${message}&sender=${process.env.SMS_GATEWAY_SENDER}${test}`
            );

            https
                .get(`${process.env.SMS_GATEWAY_URL}/send/?${queryParameters}`, (res: any) => {
                    let data = '';

                    res.on('data', (chunk: any) => (data += chunk));
                    res.on('end', () => {
                        resolve(data);
                    });
                })
                .on('error', (e) => {
                    reject(e);
                });
        });
    }
}
