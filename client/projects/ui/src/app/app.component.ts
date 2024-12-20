import { Component, OnInit } from '@angular/core';
import { ConfigService, CookieService } from '@common/src/public-api';
@Component({
    selector: 'ui-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
})
export class AppComponent {
    title = 'Home';

    constructor (
        private cookieService: CookieService,
        private configService: ConfigService
    ) {
    }

    async ngOnInit(): Promise<void> {
        const configuration = this.configService.getConfiguration();

        if (this.cookieService.exists('lang')) {
            const cookie = this.cookieService.get('lang');
            const parts = cookie.split('|');
            
            configuration.selectedLanguage = parts[0];
            configuration.language = parts[1];
        } else {
            configuration.selectedLanguage = configuration.defaultLanguage;
        }
    }
}
