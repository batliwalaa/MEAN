import { Component, Inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService, BaseComponent, CookieKeys, CookieService, WINDOW } from "@common/src/public-api";

@Component({
    selector: 'ui-location-component',
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent extends BaseComponent {
    location: string;
    city: string;

    constructor(
        @Inject(WINDOW) window: any,
        router: Router,
        private cookieService: CookieService,
        private authService: AuthService
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {
        this.location = "412207";
        this.city = "Pune";
    }

    public get hasLocation(): boolean {
        return this.cookieService.exists(CookieKeys.LocationCookie);
    }

    public get authenticated(): boolean {
        return this.authService && this.authService.user && this.authService.user.authenticated;
    }
}