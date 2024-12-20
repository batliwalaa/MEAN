import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ILookup } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class StateCountyProvinceResolver  {
    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<Array<ILookup>> {
        return [
            { id: 'Andra Pradesh', value: 'Andra Pradesh' },
            { id: 'Arunachal Pradesh', value: 'Arunachal Pradesh' },
            { id: 'Assam', value: 'Assam' },
            { id: 'Bihar', value: 'Bihar' },
            { id: 'Chhattisgarh', value: 'Chhattisgarh' },
            { id: 'Goa', value: 'Goa' },
            { id: 'Maharashtra', value: 'Maharashtra' },
        ];
    }
}
