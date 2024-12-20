import { Injectable } from '../core/decorators';
import nodeMailer, { SendMailOptions } from 'nodemailer';

@Injectable()
export class SESMailerService {
    constructor() {
    }
    
    public async sendMail(to: string, subject: string, message: string, html: boolean = true): Promise<any> {
        const config = {
            host: process.env.SMTP_SERVER_NAME,
            port: Number(process.env.SMTP_SERVER_PORT),
            secure: false,
            auth: {
                user: process.env.SMTP_SERVICE_USER_NAME,
                pass: process.env.SMTP_SERVICE_PASSWORD,
            },
        };

        const mailOptions: SendMailOptions = {
            from: process.env.SMTP_MAIL_FROM,
            to,
            subject,
            html: message,
        };

        const transport = nodeMailer.createTransport(config);
        const response = await transport.sendMail(mailOptions);

        try {
            transport.close();
        } catch {}

        return response;
    }
}
