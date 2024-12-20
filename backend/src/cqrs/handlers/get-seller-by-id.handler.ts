import { IHandler } from '../../core/mediator/handler';
import { GetSellerByIdRequest } from '../';
import { Injectable } from '../../core/decorators';
import { Seller } from '../../models';
import { SellerRepository } from '../../repositories/seller.repository';

@Injectable()
export class GetSellerByIdHandler implements IHandler<GetSellerByIdRequest, Seller> {
    constructor(
        private sellerRepository: SellerRepository
    ) {
    }
    public async handle(request: GetSellerByIdRequest): Promise<Seller> {
        return await this.sellerRepository.getByID(request.sellerID)
    }
}
