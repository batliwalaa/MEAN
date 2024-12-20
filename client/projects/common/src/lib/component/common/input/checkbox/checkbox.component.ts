import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BaseInputComponent } from '../base.input.component';

@Component({
    selector: 'ui-checkbox-component',
    templateUrl: './checkbox.component.html',
    styleUrls: ['./checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent extends BaseInputComponent {
    isValid = true;

    constructor() {
        super();
    }

    protected async init(): Promise<void> {
        this.data = false;

        return Promise.resolve();
    }

    onCheckboxClick(): void {
        this.data = !this.data;

        this.valueChange.emit({ name: this.name, value: this.data });
    }

    validate(): void {
        if (this.metadata.validators && this.metadata.validators.required === '') {
            this.isValid = this.data === true;
        }
    }
}
