import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base.input.component';

@Component({
    selector: 'ui-number-component',
    templateUrl: './number.component.html',
    styleUrls: ['./number.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberComponent extends BaseInputComponent {
    min: number;
    max: number;

    @Input() style: string;

    protected async init(): Promise<void> {
        this.type = 'number';
        return Promise.resolve();
    }

    protected onMetadata(): void {
        this.max = Number(this.metadata.qty.max);
        this.min = Number(this.metadata.qty.min);
    }

    onIncrement(): void {
        if (this.data >= this.max) {
            this.data = this.max;
            return;
        }
        this.data++;

        this.valueChange.emit({ name: this.name, value: this.data });
    }

    onDecrement(): void {
        if (this.data <= this.min) {
            this.data = this.min;
            return;
        }

        this.data--;

        this.valueChange.emit({ name: this.name, value: this.data });
    }
}
