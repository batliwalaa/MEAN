import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';

import { SearchService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class ListDataResolver  {
    constructor(private searchService: SearchService) {}

    async resolve(route: ActivatedRouteSnapshot, _: RouterStateSnapshot): Promise<any> {
        const query = route.params['query'];
        if (query) {
            return await this.searchService.search(query).toPromise();
        }

        Promise.resolve([]);
    }
}
