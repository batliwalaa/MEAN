import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'ui-star-component',
    templateUrl: './star.component.html',
    styleUrls: ['./star.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarComponent {
    @Input() selected: boolean = false;
    @Input() value: number = 0;
    @Output() onChange: EventEmitter<{ selected: boolean, value: number }> = new EventEmitter<{ selected: boolean, value: number }>();

    get rating(): string {
        return `--rating: ${this.selected ? 1 : 0}`;
    }

    onStarClick(): void {
        this.onChange.emit({ selected: !this.selected, value: this.value });
    }
}