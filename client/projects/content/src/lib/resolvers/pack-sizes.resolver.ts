import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { DetailService } from '../services/detail.service';

@Injectable({
    providedIn: 'root',
})
export class PackSizesResolver  {
    constructor(private detailService: DetailService) {}

    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        const id = route.params['id'];
        return await this.detailService.getPackSizes(id).toPromise();
    }
}
