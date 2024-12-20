import { Directive, ElementRef, AfterViewInit, Inject, Input } from '@angular/core';
import { BaseComponent } from '../component/base.component';
import { Observable, Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { WINDOW } from '../services/window.service';

@Directive({
    selector: '[uiCheckAllInputsValid]',
})
export class CheckAllInputsValidDirective extends BaseComponent implements AfterViewInit {
    private controls: Array<HTMLElement> = [];
    private changes: any;
    validationStateChange: Subject<boolean> = new Subject<boolean>();

    @Input() uiCheckAllInputsValid: Observable<boolean>;

    constructor(
        private el: ElementRef,
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    async ngAfterViewInit(): Promise<void> {
        this.uiCheckAllInputsValid.pipe(takeUntil(this.$destroy)).subscribe((initialize: boolean) => {
            if (!initialize) return;
            
            this.buildControlList(this.el.nativeElement);
            this.changes = timer(250, 1000);
            this.changes.pipe(takeUntil(this.$destroy)).subscribe((v) => {
                this.validationStateChange.next(
                    this.controls.findIndex((c) => c.className.indexOf('ng-invalid') >= 0) === -1
                );
            });
        });

        await Promise.resolve();
    }

    private async buildControlList(nativeElement: HTMLElement): Promise<void> {
        if (!(nativeElement instanceof HTMLSelectElement) && nativeElement && nativeElement.hasChildNodes()) {
            for (let i = 0; i < nativeElement.children.length; i++) {
                if (nativeElement.children[i] instanceof HTMLElement) {
                    await this.buildControlList(<HTMLElement>nativeElement.children[i]);
                }
            }
        } else {
            if (nativeElement.hasAttribute('uicheckisvalid')) {
                this.controls.push(nativeElement);
            }
        }

        return Promise.resolve();
    }
}
