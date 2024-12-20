import { ChangeDetectionStrategy, Component, Inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import { ConfigService } from "../../services/config.service";
import { CookieService } from "../../services/cookie.service";
import { NavigationService } from "../../services/navigation.service";
import { WINDOW } from "../../services/window.service";
import { IConfiguration } from "../../types/configuration";
import { BaseComponent } from "../base.component";

@Component({
    selector: 'ui-language-selector-component',
    templateUrl: './language-selector.component.html',
    styleUrls: ['./language-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSelectorComponent extends BaseComponent {
    private _configuration: IConfiguration;

    @Input() metadata: any;

    selectedLanguage: string;
    constructor(
        configService: ConfigService,
        router: Router,
        @Inject(WINDOW) window: Window,
        private cookieService: CookieService

    ) {
        super(router, window)
        this._configuration = configService.getConfiguration();
        this.selectedLanguage = this._configuration.selectedLanguage;
    }

    public async onLanguageChange(language: string): Promise<void> {
        if (this.selectedLanguage === language) return;
        
        this._configuration.selectedLanguage = language;
        this.selectedLanguage = language;
        
        switch(language) {
            case 'English':
                this._configuration.language = 'en';
                break;
            case 'हिंदी':
                this._configuration.language = 'hi';
                break;
            case 'मराठी':
                this._configuration.language = 'mr';
                break;
        }

        if (this.cookieService.exists('lang')) {
            this.cookieService.delete('lang');
        }

        this.cookieService.set('lang', `${language}|${this._configuration.language}`);
        this.window.location.reload();
    }

    public get options(): Array<string> {
        return this.metadata && this.metadata.language && this.metadata.language.options;
    }
}
