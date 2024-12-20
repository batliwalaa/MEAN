import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { RouteKeys } from "../constants/route.keys";
import { NavigationService } from "./navigation.service";

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    constructor(
        private navigationService: NavigationService
    ) {
    }

    public async navigate(key: string, addTohistory: boolean = false): Promise<void> {
        let routeKey: string = key ?? 'AccountHome';
       
        this.navigationService.resetMenuState();

        await this.navigationService.clear();        
        await this.navigationService.navigateForUrl(RouteKeys[routeKey], RouteKeys.AccountHome, addTohistory);
    }
}