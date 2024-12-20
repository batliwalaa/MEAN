import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { BaseInputComponent } from '../base.input.component';

@Component({
    selector: 'ui-textbox-component',
    templateUrl: './textbox.component.html',
    styleUrls: ['./textbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextboxComponent extends BaseInputComponent {
    @Output() keyboardKeyup = new EventEmitter<KeyboardEvent>();

    protected setFocus(): void {
        this.inputControl.nativeElement.focus();
    }

    protected async init(): Promise<void> {
        return Promise.resolve();
    }

    public focus(): void {
        this.inputControl.nativeElement.focus();
    }

    onChange(): void {
        this.valueChange.emit({ name: this.name, value: this.inputControl.nativeElement.value });
    }

    onKey($event: KeyboardEvent): void {
        this.keyboardKeyup.emit($event);
    }
}
