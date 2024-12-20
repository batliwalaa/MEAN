import { Component, ContentChild, ContentChildren, Inject, QueryList, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { WINDOW } from "@common/src/lib/services/window.service";
import { mergeAll, switchMap } from 'rxjs/operators';

import { AutoCompleteContentDirective } from '../../../../directives/auto-complete-content.directive';
import { BaseComponent } from '../../../base.component';
import { OptionComponent } from './child-components/option/option.component';

@Component({
    selector: 'ui-autocomplete',
    templateUrl: './auto-complete.component.html',
    styleUrls: ['./auto-complete.component.scss'],
    exportAs: 'uiAutoComplete'
})
export class AutoCompleteComponent extends BaseComponent {
    @ViewChild('root') rootTemplate: TemplateRef<any>;
    @ContentChild(AutoCompleteContentDirective) content: AutoCompleteContentDirective;
    @ContentChildren(OptionComponent) options: QueryList<OptionComponent>;

    constructor (
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    optionsClick() {
        return this.options.changes
            .pipe(
                switchMap((options: Array<any>) => {
                    const click$ = options.map(option => option.click$);
                    return mergeAll(...click$);
                })
            );
    }
}