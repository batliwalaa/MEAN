import { Directive, TemplateRef } from "@angular/core";

@Directive({
    selector: '[uiCarouselItem]'
})
export class CarouselItemDirective {
    constructor (
        public tmpl: TemplateRef<any>
    ) {}
}
