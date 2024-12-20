import { Catch, Controller, Get, Injectable, Patch, Post, Validator } from '../core/decorators';
import { ModelBinder } from '../core/decorators/model.binder.decorator';
import { ApiController } from './api.controller';
import { IdValidator } from '../validators/id-validator';
import { ReviewService } from '../services/review.service';
import { ActionResult } from '../core/action-results/action-result';
import { Authorize } from '../core/decorators/authorize.decorator';
import { CookieValidator } from '../core/decorators/cookie-validator.decorator';
import { TokenCookieValidator } from '../cookie-validators/token-cookie.validator';
import { Review } from '../models';

@Injectable()
@Controller('/productreview')
export default class ProductReviewController extends ApiController {
    constructor(private reviewService: ReviewService) {
        super();
    }

    @Get('/:productID/:pn/:limit')
    @Catch()
    @ModelBinder(['productID::string', 'pn::number', 'limit::number'])
    @Validator(IdValidator)
    async get(productID: string, pn: number, limit: number): Promise<ActionResult> {
        const reviews = await this.reviewService.getByProductID(productID, Number(pn), true, limit);

        return this.Ok(reviews);
    }

    @Patch('/:reviewID')
    @Catch()
    @ModelBinder(['reviewID::string', '@FromBody::vote'])
    async patch(reviewID: string, vote: {likeVote: boolean, dislikeVote: boolean }): Promise<ActionResult> {
        const ip: any = this.request.headers['x-forwarded-for'] || this.request.connection.remoteAddress;
        
        await this.reviewService.updateVotes(reviewID, vote, ip)

        return this.Accepted();
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get('/order/:orderID/product/:productID')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['orderID::string', 'productID::string'])
    async getUserReviewForOrderAndProduct(orderID: string, productID: string): Promise<ActionResult> {
        const reviews = await this.reviewService.getUserReviewByOrderAndProduct(this.request.session.userID, orderID, productID);

        return this.Ok(reviews);
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Get('/order/:orderID')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['orderID::string'])
    async getUserReviewsForOrder(orderID: string): Promise<ActionResult> {
        const reviews = await this.reviewService.getUserReviewByOrder(this.request.session.userID, orderID);

        return this.Ok(reviews);
    }

    @Authorize(['customer', 'admin', 'staff'])
    @Post('')
    @Catch()
    @CookieValidator(TokenCookieValidator)
    @ModelBinder(['@FromBody::review'])
    async post(review: Review): Promise<ActionResult> {
        const reviews = await this.reviewService.save(this.request.session.userID, review);

        return this.Ok(reviews);
    }
}
