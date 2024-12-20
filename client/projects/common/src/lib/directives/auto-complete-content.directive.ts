import { Directive, Inject, Input, TemplateRef } from '@angular/core';
import { OverlayRef } from '@angular/cdk/overlay';

import { BaseComponent } from '../component/base.component';
import { AutoCompleteComponent } from '../component/common/input/auto-complete/auto-complete.component';
import { WINDOW } from '../services/window.service';
import { Router } from '@angular/router';

@Directive({
    selector: '[uiAutoCompleteContent]',
})
export class AutoCompleteContentDirective extends BaseComponent {
    @Input() autoCompleteComponent: AutoCompleteComponent;
    private overlayRef: OverlayRef;

    constructor (
        public tpl: TemplateRef<any>,
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }
}