import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[uiCheckIsValid]',
})
export class CheckIsValidDirective {
    constructor(private el: ElementRef) {}

    public isValid(): boolean {
        return this.el.nativeElement.className.indexOf('ng-invalid') >= 0;
    }
}
