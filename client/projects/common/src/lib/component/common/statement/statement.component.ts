import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';
import { Router } from '@angular/router';
import { WINDOW } from '@common/src/lib/services/window.service';
import { BaseComponent } from '../../base.component';

@Component({
    selector: 'ui-statement-component',
    templateUrl: './statement.component.html',
    styleUrls: ['./statement.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StatementComponent extends BaseComponent {
    @Input() metadata: any;

    constructor (
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }
}
