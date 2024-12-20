import { OrderService, UserService } from ".";
import { RedisService } from "../cache";
import { Injectable } from "../core/decorators";
import { Order, Result, Review } from "../models";
import { LikeDislikeVote } from "../models/like-dislike-vote";
import { ReviewRepository } from "../repositories";
import { BaseService } from "./base.service";

@Injectable() 
export class ReviewService extends BaseService {
    constructor(
        private reviewRepository: ReviewRepository,
        private userService: UserService,
        private orderService: OrderService,
        redisService: RedisService
    ) {
        super(redisService);
    }

    public async getByProductID(productID: string, pageNumber: number = 1, processed?: boolean, limit: number = 10): Promise<Result<Review>> {
        const reviews = await this.reviewRepository.getByProductID(productID, pageNumber, processed, limit);

        if (Array.isArray(reviews.items) && reviews.items.length > 0) {
            for (let i = 0; i < reviews.items.length; i++) {
                if (!reviews.items[i].user) {
                    const user = await this.userService.getUserById(reviews.items[i].createdBy);
                    reviews.items[i].user = `${user.firstName} ${user.lastName}`;
                }
            }
        }

        return reviews;
    }

    public async getUnprocessed(): Promise<Array<Review>> {
        return await this.reviewRepository.getUnprocessed();
    }

    public async setProcessed(): Promise<void> {
        return await this.reviewRepository.setProcessed();
    }

    public async updateVotes(reviewID: string, vote: LikeDislikeVote, ipAddress: string): Promise<void> {
        await this.reviewRepository.updateVotes(reviewID, vote, ipAddress);
    }

    public async getUserReviewByOrderAndProduct(userID: string, orderID: string, productID: string): Promise<Review> {
        const review = await this.reviewRepository.getUserReviewByOrderAndProduct(userID, orderID, productID);

        if (review && !review.user) {
            const user = await this.userService.getUserById(review.createdBy);
            review.user = `${user.firstName} ${user.lastName}`;
        }

        return review;
    }

    public async getUserReviewByOrder(userID: string, orderID: string): Promise<Array<Review>> {
        let reviews = await this.reviewRepository.getUserReviewByOrder(userID, orderID);
        
        if (!reviews || (Array.isArray(reviews) && reviews.length === 0)) {
            const order: Order = await this.orderService.getByOrderID(userID, orderID);
            const user = await this.userService.getUserById(userID);

            for (let i= 0; i < order.items.length; i++) {
                const review = await this.reviewRepository.save(userID, 
                    { _id: null, productID: order.items[i]._id, orderID, headline: '', review: '', rating: 0,featuresRating: [], user: `${user.firstName} ${user.lastName}`, urls: [],processed: false });

                reviews.push(review);
            }
        }
        
        return reviews;
    }

    public async save(userID: string, review: Review): Promise<Review> {
        return await this.reviewRepository.save(userID, review);
    }
}
