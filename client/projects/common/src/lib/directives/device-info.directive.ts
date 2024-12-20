import { Directive, ElementRef } from '@angular/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Directive({
    selector: '[uiDeviceInfo]',
})
export class DeviceInfoDirective {
    constructor(el: ElementRef, private deviceDetectorService: DeviceDetectorService) {
        const nativeElement: HTMLElement = el.nativeElement;
        const deviceInfo = deviceDetectorService.getDeviceInfo();

        nativeElement.setAttribute('data-device', this.getDevice());
        nativeElement.setAttribute('data-browser', deviceInfo.browser);
        nativeElement.setAttribute('data-browser-version', deviceInfo.browser_version);
    }

    private getDevice(): string {
        return this.deviceDetectorService.isMobile()
            ? 'Mobile'
            : this.deviceDetectorService.isTablet()
            ? 'Tablet'
            : 'Desktop';
    }
}
