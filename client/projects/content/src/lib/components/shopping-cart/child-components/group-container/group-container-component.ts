import { Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';

import { BaseComponent, ShoppingCartItemGroup, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-group-container',
    templateUrl: './group-container-component.html',
    styleUrls: ['./group-container-component.scss'],
})
export class GroupContainerComponent extends BaseComponent {
    @Input() group: ShoppingCartItemGroup;
    @Input() metadata: any;

    constructor(
        @Inject(WINDOW) window: any,
        router: Router,
    ) {
        super(router, window);
    }
}
