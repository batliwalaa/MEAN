import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base.input.component';

@Component({
    selector: 'ui-radio-component',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RadioComponent extends BaseInputComponent {
    isValid = true;
    @Input() smallRadio: boolean;
    @Input() disabled: boolean;
    @Input() label: string;

    constructor() {
        super();
    }

    protected async init(): Promise<void> {
        return Promise.resolve();
    }

    onRadioClick(): void {
        if (!this.disabled) {
            this.data = true;
            this.valueChange.emit({ name: this.name, value: this.data });
        }
    }
}
