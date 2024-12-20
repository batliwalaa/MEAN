import { Injectable, PLATFORM_ID, Inject, TransferState } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceDetectorService } from 'ngx-device-detector';

import { ConfigService, HttpService } from '@common/src/public-api';

@Injectable({
    providedIn: 'root',
})
export class MenuService extends HttpService {
    constructor(
        httpClient: HttpClient,
        configService: ConfigService,
        @Inject(PLATFORM_ID) platformId,
        transferState: TransferState,
        private deviceDetectorService: DeviceDetectorService
    ) {
        super(httpClient, platformId, transferState, configService);
    }

    public getMainMenu(): Observable<any> {
        return this.executeGet(
            `menu_mainmenu_${this.getDevice()}`,
            `${this.baseUrl}/menu/mainmenu/${this.getDevice()}`
        );
    }

    public getBurgerMenu(key: string): Observable<any> {
        return this.executeGet(
            `menu_burgermenu_${this.getDevice()}`,
            `${this.baseUrl}/menu/burger menu/${this.getDevice()}`
        );
    }

    public getSubMenu(key: string): Observable<any> {
        return this.executeGet(
            `menu_${key}_submenu_${this.getDevice()}`,
            `${this.baseUrl}/menu/${key}/submenu/${this.getDevice()}`
        );
    }

    public getSidebar(key: string): Observable<any> {
        return this.executeGet(
            `menu_${key}_submenu_sidebar_${this.getDevice()}`,
            `${this.baseUrl}/menu/${key}/submenu/sidebar/${this.getDevice()}`
        );
    }

    public getProductTypeSidebar(keyAsBase64: string): Observable<any> {
        return this.executeGet(`menu_${keyAsBase64}`, `${this.baseUrl}/menu/${keyAsBase64}`);
    }

    private getDevice(): string {
        return this.deviceDetectorService.isMobile()
            ? 'Mobile'
            : this.deviceDetectorService.isTablet()
            ? 'Tablet'
            : 'Desktop';
    }
}
