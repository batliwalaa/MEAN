export interface ReviewVote {
    _id: any;
    reviewID: string;
    ipAddress: string;
    likeVote?: boolean;
    dislikeVote: boolean;
    dateCreated: Date;
}