import { Component, ElementRef, Inject, Input } from "@angular/core";
import { fromEvent, Observable } from 'rxjs';

import { BaseComponent } from '@common/src/lib/component/base.component';
import { mapTo } from 'rxjs/operators';
import { Router } from "@angular/router";
import { WINDOW } from "@common/src/lib/services/window.service";

@Component({
    selector: 'ui-autocomplete-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})
export class OptionComponent extends BaseComponent {
    @Input() value: string;
    click$: Observable<string>;

    constructor (
        private host: ElementRef,
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {
        this.click$ = fromEvent(this.element, 'click')
            .pipe(
                mapTo(this.value)
            );
    }

    get element(): any {
        return this.host.nativeElement;
    } 
}