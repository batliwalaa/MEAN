import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent, WINDOW } from '@common/src/public-api';

@Component({
    selector: 'ui-content',
    templateUrl: './content.component.html',
    styleUrls: ['./content.component.scss'],
})
export class ContentComponent extends BaseComponent {
    constructor(
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }
}
