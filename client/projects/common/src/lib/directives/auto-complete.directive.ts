import { Directive, ElementRef, Inject, Input, ViewContainerRef } from '@angular/core';
import { ConnectionPositionPair, Overlay, OverlayOutsideClickDispatcher, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { AbstractControl, NgControl } from '@angular/forms';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { BaseComponent } from '../component/base.component';
import { AutoCompleteComponent } from '../component/common/input/auto-complete/auto-complete.component';
import { WINDOW } from '../services/window.service';
import { Router } from '@angular/router';

@Directive({
    selector: '[uiAutoComplete]',
})
export class AutoCompleteDirective extends BaseComponent {
    @Input() autoComplete: AutoCompleteComponent;
    private overlayRef: OverlayRef;

    constructor(
        private host: ElementRef<HTMLInputElement>,
        private ngControl: NgControl,
        private vcr: ViewContainerRef,
        private overlay: Overlay,
        @Inject(WINDOW) window: Window,
        router: Router
    ) {
        super(router, window);
    }

    protected async init(): Promise<void> {
        fromEvent(this.origin, 'focus')
            .pipe(takeUntil(this.$destroy))
            .subscribe(() => {
                this.openDropdown();
                this.autoComplete.optionsClick()
                    .pipe(takeUntil(this.overlayRef.detachments()))
                    .subscribe((value: string) => {
                        this.control.setValue(value);
                        this.close()
                    })
            })
    }

    get control(): AbstractControl {
        return this.ngControl.control;
    }

    get origin(): HTMLInputElement {
        return this.host.nativeElement;
    }

    openDropdown(): void {
        this.overlayRef = this.overlay.create({
            width: this.origin.offsetWidth,
            maxHeight: 40*3,
            backdropClass: '',
            scrollStrategy: this.overlay.scrollStrategies.reposition(),
            positionStrategy: this.getOverlayPosition()
        });

        const template = new TemplatePortal(this.autoComplete.rootTemplate, this.vcr);
        this.overlayRef.attach(template);
        overlayClickOutside(this.overlayRef, this.origin).subscribe(() => this.close());
    }

    private close(): void {
        this.overlayRef.detach();
        this.overlayRef = null;
    }

    private getOverlayPosition(): any {
        const positions = [
            new ConnectionPositionPair(
                { originX: 'start', originY: 'bottom' },
                { overlayX: 'start', overlayY: 'top' }
            )
        ];

        return this.overlay
            .position()
            .flexibleConnectedTo(this.origin)
            .withPositions(positions)
            .withFlexibleDimensions(false)
            .withPush(false);
    }
}

export function overlayClickOutside(overlayRef: OverlayRef, origin: HTMLElement): any {
    return fromEvent<MouseEvent>(document, 'click')
        .pipe(
            filter(event => {
                const clickTarget = event.target as HTMLElement;
                const notOrigin = clickTarget !== origin;
                const notOverlay = !!overlayRef && (overlayRef.overlayElement.contains(clickTarget) === false);
                return notOrigin && notOverlay;
            }),
            takeUntil(overlayRef.detachments())
        );
}