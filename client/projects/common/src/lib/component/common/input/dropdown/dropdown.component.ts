import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { BaseInputComponent } from '../base.input.component';
import { ILookup } from '../../../../types/ILookup';

@Component({
    selector: 'ui-dropdown-component',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent extends BaseInputComponent {
    private _style: string;
    @Input() items: Array<ILookup>;
    @Input() set style(value: string) {
        this._style = value;
    }

    get style(): string {
        return this._style;
    }

    constructor() {
        super();
    }

    onChange(): void {
        this.valueChange.emit({ name: this.name, value: this.data });
    }
}
