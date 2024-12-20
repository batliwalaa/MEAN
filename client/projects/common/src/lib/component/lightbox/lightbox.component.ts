import { ChangeDetectionStrategy, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from "@angular/core";

import { LightboxService } from '../../services/lightbox.service';

@Component({
    selector: 'ui-lightbox-component',
    templateUrl: './lightbox.component.html',
    styleUrls: ['./lightbox.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class LightboxComponent implements OnInit, OnDestroy {
    @Input() id: string;
    private element: any;

    constructor(
        private renderer: Renderer2,
        private lightboxService: LightboxService,
        el: ElementRef
    ) {
        this.element = el.nativeElement;
    }
    async ngOnInit(): Promise<void> {        
        document.body.appendChild(this.element);

        this.renderer.listen(this.element, 'click', event => {
            if (event.target.className === 'lightbox.container') {
                this.close();
            }
        });
        this.lightboxService.add(this);

        Promise.resolve();
    }

    async ngOnDestroy(): Promise<void> {
        this.lightboxService.remove(this.id);
        this.element.remove();

        await Promise.resolve();
    }
    
    open(): void {
        this.renderer.setStyle(this.element, 'display', 'block');
        this.renderer.addClass(document.body, 'lightbox-open');
    }

    close(): void {
        this.renderer.setStyle(this.element, 'display', 'none');
        this.renderer.removeClass(document.body, 'lightbox-open');
    }
}