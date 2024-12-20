import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, Injector, APP_ID } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './routing-module/app-routing.module';
import { MenuModule } from '@menu/src/public-api';
import { SearchModule } from '@search/src/public-api';
import { FooterModule } from '@footer/src/public-api';
import { HeaderModule } from '@header/src/public-api';
import { ShellModule } from '@shell/src/public-api';
import { AuthService, CommonAppModule, ServiceLocator, ConfigService, GlobalisationService, DataStoreService, ResourceKeys } from '@common/src/public-api';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { RequestInterceptor, RetryInterceptor } from '@common/src/public-api';
import { first } from 'rxjs/operators';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        CommonAppModule,
        AppRoutingModule,
        ShellModule,
        MenuModule,
        SearchModule,
        FooterModule,
        HeaderModule
    ],
    providers: [
        ConfigService,
        { provide: APP_INITIALIZER, useFactory: AppInitializer, deps: [
            ConfigService,
            AuthService,
            GlobalisationService,
            DataStoreService
        ], multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RequestInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: RetryInterceptor, multi: true },
        { provide: APP_ID, useValue: 'serverApp' }
    ],
    bootstrap: [AppComponent],
})
export class AppModule {
    constructor(injector: Injector) {
        ServiceLocator.Injector = injector;
    }
}

export function AppInitializer(
    configService: ConfigService,
    authService: AuthService,
    globalisationService: GlobalisationService,
    dataStoreService: DataStoreService
) {
    return async () => {
        await configService.load(environment.configFile);
        await authService.initialize();
        globalisationService.get(ResourceKeys.Notifications).pipe(first()).subscribe(data =>{
            dataStoreService.push('notification-messages', data);
        });
    };
}
