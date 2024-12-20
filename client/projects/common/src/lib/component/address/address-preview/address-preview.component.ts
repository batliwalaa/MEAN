import { ChangeDetectionStrategy, Component, Inject, Input } from "@angular/core";
import { Router } from "@angular/router";
import { WINDOW } from "@common/src/lib/services/window.service";
import { BaseComponent } from "../../base.component";

@Component({
    selector: 'ui-address-preview-component',
    templateUrl: './address-preview.component.html',
    styleUrls: ['./address-preview.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddressPreviewComponent extends BaseComponent {
    @Input() deliveryAddress: any;
    @Input() metadata: any;
    @Input() compact = false;

    constructor(
        router: Router,
        @Inject(WINDOW) window: any
    ) {
        super(router, window);
    }
}
