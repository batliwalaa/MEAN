import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { GlobalisationService } from '../services/globalisation.service';
import { ResourceKeys } from '../constants/resource.keys';

@Injectable({
    providedIn: 'root',
})
export class MetadataResolver  {
    constructor(private globalisationService: GlobalisationService) {}

    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        if (route && route.data && route.data.resourceKeys) {
            const keys = route.data.resourceKeys;
            const result = {};

            for (let i = 0; i < keys.length; i++) {
                result[keys[i]] = await this.globalisationService.get(ResourceKeys[keys[i]]).toPromise();
            }

            return result;
        }
        
        return Promise.resolve({});
    }
}
