import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'ui-image-lightbox-component',
    templateUrl: './image-lightbox.component.html',
    styleUrls: ['./image-lightbox.component.scss']
})
export class ImageLightboxComponent {
    @Input() src: string;
    @Input() id: string;
    @Output() close: EventEmitter<string> = new EventEmitter<string>();    

    public async onlightboxClose(id: string): Promise<void> {
        this.close.emit(id);

        await Promise.resolve();
    }
}