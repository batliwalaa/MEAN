import { Component, ViewChild, ElementRef, ChangeDetectionStrategy } from '@angular/core';
import { BaseInputComponent } from '../base.input.component';

@Component({
    selector: 'ui-confirm-textbox-component',
    templateUrl: './confirm.textbox.component.html',
    styleUrls: ['./confirm.textbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmTextboxComponent extends BaseInputComponent {
    protected setFocus(): void {
        this.inputControl.nativeElement.focus();
    }

    protected async init(): Promise<void> {
        this.data = '';

        return Promise.resolve();
    }

    onBlur(): void {
        this.valueChange.emit({ name: this.name, value: this.data });
    }
}
