import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WINDOW } from '@common/src/lib/services/window.service';
import { Address } from '@common/src/lib/types/address';
import { BaseComponent } from '../../base.component';

@Component({
    selector: 'ui-address-display',
    templateUrl: './address-display.component.html',
    styleUrls: ['./address-display.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressDisplayComponent extends BaseComponent {
    @Input() address: Address;

    constructor(
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {}
}
