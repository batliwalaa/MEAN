import { Directive, ElementRef, EventEmitter, Inject, Output, OnInit, OnDestroy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { from } from 'rxjs';
import { delay, first } from 'rxjs/operators';

@Directive({
    selector: '[outsideClick]',
})
export class OutsideClickDirective implements OnInit, OnDestroy {
    private _initialising: boolean;
    private evt =  (e: Event) => this.onDocumentClick(e);

    constructor(@Inject(DOCUMENT) private document: any, private element: ElementRef) {}

    @Output() outsideClick: EventEmitter<Event> = new EventEmitter<Event>();

    ngOnInit() {
        this._initialising = true;
        this.document.body.addEventListener('click', this.evt);
        from([0]).pipe(delay(250), first()).subscribe(() => {
            this._initialising = false; 
        });
    }

    ngOnDestroy(): void {
        this.document.body.removeEventListener('click', this.evt);
    }

    private onDocumentClick(e: Event): void {
        if (this._initialising || (<HTMLElement>e.target).nodeName.toLowerCase() === 'i') return;
        
        if (!this.element.nativeElement.contains(e.target)) {
            this.outsideClick.emit(e);
            // this.document.body.removeEventListener('click', this.evt);
        }
    }
}
