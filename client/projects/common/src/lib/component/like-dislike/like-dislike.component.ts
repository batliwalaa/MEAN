import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
    selector: 'ui-like-dislike-component',
    templateUrl: './like-dislike.component.html',
    styleUrls: ['./like-dislike.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LikeDislikeComponent {
    @Input() likeVote: number;
    @Input() dislikeVote: number;
    @Input() metadata: any;
    
    @Output() voteChange: EventEmitter<{ likeVote: boolean, dislikeVote: boolean }> = new EventEmitter<{likeVote: boolean, dislikeVote: boolean }>();

    onLikeVoteChange(): void {
        this.voteChange.emit({ likeVote: true, dislikeVote: false});
    }

    onDislikeVoteChange(): void {
        this.voteChange.emit({ likeVote: false, dislikeVote: true });
    }
}
