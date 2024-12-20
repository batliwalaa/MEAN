import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { HomePageService } from '../services';

@Injectable({
    providedIn: 'root',
})
export class HomePageResolver  {
    constructor(private homePageService: HomePageService) {}

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        return await this.homePageService.get(route.data.page).toPromise();
    }
}
