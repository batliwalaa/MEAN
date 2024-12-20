import { Catch, Controller, Get, Injectable, ModelBinder } from '../core/decorators';
import { ApiController } from './api.controller';

@Injectable()
@Controller('/session/user')
export default class SessionController extends ApiController {
    constructor() {
        super();
    }

    @Get(['/get'])
    @Catch()
    @ModelBinder([])
    async currentSession(): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                if (!this.request.session.language || this.request.session.language.trim().length !== 2) {
                    this.request.session.language = 'en';
                }
        
                resolve(this.Ok());
            } catch(e) {
                reject(e);
            }
        })
        
    }
}
