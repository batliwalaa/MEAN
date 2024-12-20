import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'ui-star-rating-component',
    templateUrl: './star-rating.component.html',
    styleUrls: ['./star-rating.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StarRatingComponent {
    @Input() rating: number = 0;
    @Output() onChange: EventEmitter<{ selected: boolean, value: number }> = new EventEmitter<{ selected: boolean, value: number }>();

    public async onStarStateChange(event: { selected: boolean, value: number }): Promise<void> {
        this.onChange.emit(event);
    }

    isSelected(value: number): boolean {
        return value <= this.rating;
    }
}