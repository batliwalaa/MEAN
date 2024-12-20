import { ChangeDetectionStrategy, Component, EventEmitter, Inject, Input, Output } from '@angular/core';

import { BaseComponent } from '../../base.component';
import { ILookup } from '../../../types/ILookup';
import { Address } from '../../../types/address';
import { ConfigService } from '../../../services/config.service';
import { Router } from '@angular/router';
import { WINDOW } from '../../../services/window.service';

@Component({
    selector: 'ui-address-entry',
    templateUrl: './address-entry.component.html',
    styleUrls: ['./address-entry.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressEntryComponent extends BaseComponent {
    private _address: Address = {};
    private _country: string;

    @Output() addressChange = new EventEmitter<Address>();
    @Input() states: Array<ILookup>;
    @Input() metadata: any;
    @Input() set address(value: Address) {
        if (value) {
            this._address = JSON.parse(JSON.stringify(value));
        }
    }
    get address(): Address {
        return this._address;
    }

    addressTypes: Array<ILookup> = [
        { id: 'Home', value: 'Home (7am - 9pm)' },
        /* { id: 'Work', value: 'Work/Office (10am - 5pm)' }, */
    ];

    constructor(
        @Inject(WINDOW) window: Window,
        configService: ConfigService,
        router: Router
    ) {
        super(router, window);
        this._country = configService.getConfiguration().country;
    }

    protected async init(): Promise<void> {
        return Promise.resolve();
    }

    valueChanged(): void {
        this.address.country = this._country;
        this.addressChange.emit(this.address);
    }
}
